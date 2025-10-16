import { pool } from '../../config/db';
import { copySchema } from './copy.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';
import { query } from "../../core/db";

export const CopyRepo = {
    async get_trip_copy(trip_id:number){
        const query = `
            SELECT COUNT(*)::int as total_copied
            FROM likes
            WHERE trip_id = $1
        `;
        
        const {rows} = await pool.query(query, [trip_id]);
        const parsed = copySchema.safeParse(rows[0]);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async add_copy(user_id:string, trip_id:number){
        const query = `
            INSERT INTO likes(trip_id, user_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const {rows} = await pool.query(query, [trip_id, user_id]);
        const parsed = z.object({
            trip_id: z.coerce.number(),
            user_id: z.string().min(1),   
        }).safeParse(rows[0]);
        if (!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async check_copy(user_id:string, trip_id:number){
        const query = `
            SELECT *
            FROM likes
            WHERE trip_id = $1 AND user_id = $2
        `;
        const {rowCount} = await pool.query(query, [trip_id, user_id]);
        return rowCount; //1 if already copy 0 if no copy yet
    },
}

export async function copy_trip(trip_name: string, start_date: string, userId: string,trip_id: number, trip_code: string, trip_password: string) {
  const sql = `
    WITH src AS (
      SELECT t.*
      FROM trips t
      WHERE t.trip_id = $2
    ),
    new_trip AS (
      INSERT INTO trips (
        user_id, title, description, start_date, end_date, visibility_status,
        budget, trip_url, trip_code, trip_pass, trip_picture_path, planning_status
      )
      SELECT
        $1 AS user_id,
        $4 AS title,
        s.description,
        $5::date AS start_date,
        (s.end_date + (($5::date - s.start_date)))::date AS end_date,
        s.visibility_status,
        s.budget,
        s.trip_url,
        $3 AS trip_code,
        $6 AS trip_pass,
        NULL::text AS trip_picture_path,
        s.planning_status
      FROM src s
      RETURNING trip_id
    ),
    copied AS (
      INSERT INTO places_in_trip (
        place_id, trip_id, "date", time_start, time_end, is_vote,
        event_names, is_event, event_title
      )
      SELECT
        pit.place_id,
        (SELECT trip_id FROM new_trip) AS trip_id,
        (pit."date" + (($5::date - s.start_date)))::date AS "date",
        pit.time_start, pit.time_end, pit.is_vote,
        pit.event_names, pit.is_event, pit.event_title
      FROM places_in_trip pit
      JOIN src s ON s.trip_id = pit.trip_id
      WHERE pit.trip_id = $2
      RETURNING 1
    ),
    added_collab AS (
      INSERT INTO trip_collaborators (user_id, trip_id, role, accepted, seen_noti)
      VALUES ($1, (SELECT trip_id FROM new_trip), 'Owner', TRUE, 0)
      RETURNING 1
    )
    SELECT trip_id
    FROM new_trip;
  `;

  const res = await query(sql, [userId, trip_id, trip_code, trip_name, start_date, trip_password]);
  return res.rows?.[0]?.trip_id ?? 0;
}