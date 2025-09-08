import { pool } from '../../config/db';
import { TripSchema } from './trips.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z, { check } from 'zod';
import crypto, { getRandomValues } from 'crypto';
import { patch } from 'axios';

export const TripsRepo = {
	async get_user_trips(user_id:string){
		const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators tc
				WHERE tc.accepted = TRUE
				GROUP BY trip_id
			)
			SELECT 
				t.trip_id, 
				t.title, 
				jp.joined_people AS joined_people, 
				t.start_date, 
				t.end_date, 
				t.trip_picture_url AS poster_image_link, 
				t.planning_status
			FROM joinedP jp
			JOIN trips t ON jp.trip_id = t.trip_id
			JOIN trip_collaborators tc ON t.trip_id = tc.trip_id
			JOIN users u ON u.user_id = tc.user_id
			WHERE u.user_id = $1
		`;
		
		const TripsListSchema = z.array(TripSchema);

		const { rows } = await pool.query(query, [user_id]);
		console.log(rows);
		const parsed = TripsListSchema.safeParse(rows);
		if (!parsed.success) throw INTERNAL("Fail to parsed data");
		return parsed.data;
	},

	async get_specific_trip(trip_id:string){
		const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators tc
				WHERE tc.accepted = TRUE
				GROUP BY trip_id
			)
			SELECT
				t.trip_id, 
				t.title, 
				jp.joined_people AS joined_people, 
				t.start_date, 
				t.end_date, 
				t.trip_picture_url as poster_image_link, 
				t.planning_status
			FROM joinedP jp
			JOIN trips t ON jp.trip_id = t.trip_id
			WHERE t.trip_id = $1
		`;
		
		const TripListSchema = z.array(TripSchema);

		const { rows } = await pool.query(query,[trip_id]);
		console.log(rows[0]);
		const parsed = TripListSchema.safeParse(rows);
		if(!parsed.success) throw INTERNAL("Fail to parsed data");
		return parsed.data;
	},
	
	async add_trip(
		user_id: string, 
		title: string,  
		start_date: Date, 
		end_date: Date,
		trip_code: string,
		trip_pass: string,
		trip_picture_url: string | null
	) {
		const sql = `
			INSERT INTO trips (
			user_id, 
			title,
			start_date,
			end_date, 
			trip_code, 
			trip_pass, 
			trip_picture_url,
			visibility_status, 
			planning_status
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING *
		`;
		
		const values = [user_id, title, start_date, end_date, trip_code, trip_pass, trip_picture_url ?? null, false, false];

		const result = await pool.query(sql, values);
		return result.rows[0]; // will be 1 if insert success, 0 if not
	},
	
	async add_owner_collab(
		trip_id: number,
		user_id: string, 
		role: string,
		accepted: boolean,
	) {
		const query = `
			INSERT INTO trip_collaborators (trip_id, user_id, role, accepted)
			VALUES ($1,$2,$3,$4)
			RETURNING *
		`;

		const values = [trip_id, user_id, role, accepted];

		const result = await pool.query(query, values);
		return result.rowCount; // will be 1 if insert success, 0 if not
	},

	async delete_trip( user_id:string, trip_id:number ){
		const query = `DELETE FROM trips WHERE user_id = $1 AND trip_id = $2`;
		const value = [user_id, trip_id];
		const result = await pool.query(query, value);
		return result.rowCount;
	},

	async edit_trip_role (member_id: string, trip_id:number, role:string){
		const sql = `
			UPDATE trip_collaborators
			SET 
				role = $1
			WHERE user_id = $2 AND trip_id = $3
			RETURNING *
		`;
		const values = [role, member_id, trip_id];
		const { rows } = await pool.query(sql, values);
		return rows[0];
	},

	async check_owner (owner_id:string, trip_id:number){
		const query = `
			SELECT user_id
			FROM trips
			WHERE trip_id = $1 and user_id = $2
		`;
		const value = [trip_id, owner_id];
		const parsed = await pool.query(query, value);
		return parsed.rowCount
	},
}