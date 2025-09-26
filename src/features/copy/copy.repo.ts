import { pool } from '../../config/db';
import { copySchema } from './copy.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';

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