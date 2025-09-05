import { pool, supabase } from '../../config/db';
import { TripSchema } from './trips.schema';
//import { UserSchema, ProfileFile, UsersFullSchema,InvitedSchema } from './users.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';
import crypto from 'crypto';
import { patch } from 'axios';
// export type User = z.infer<typeof UserSchema>;
// export type Profile = {
//     id: string;
//     path: string;
//     fullPath: string;
// }

export const TripsRepo = {
	async get_user_trips(user_id:string):Promise<z.infer<typeof TripSchema>>{
		const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id) AS joined_people
				FROM trip_collaborators
				GROUP BY trip_id
			)
			SELECT t.trip_id, t.title, jp.joined_people, t.start_date, t.end_date, t.trip_picture_url
			FROM joinedP jp
			JOIN trips t ON jp.trip_id = t.trip_id
			JOIN trip_collaborators tc ON t.trip_id = tc.trip_id
			JOIN users u ON u.user_id = tc.user_id
			WHERE u.user_id = $1
		`;
		
		const result = await pool.query(query,[user_id]);
		const data = TripSchema.safeParse(result.rows);
		if(!data.success) throw INTERNAL("Fail to parsed data");
		return data.data;
	},

	async get_specific_trip(trip_id:string):Promise<z.infer<typeof TripSchema>>{
		const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id) AS joined_people
				FROM trip_collaborators
				GROUP BY trip_id
			)
			SELECT t.trip_id, t.title, jp.joined_people, t.start_date, t.end_date, t.trip_picture_url
			FROM joinedP jp
			JOIN trips t ON jp.trip_id = t.trip_id
			WHERE t.trip_id = $1
		`;
		
		const result = await pool.query(query,[trip_id]);
		const data = TripSchema.safeParse(result.rows);
		if(!data.success) throw INTERNAL("Fail to parsed data");
		return data.data;
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
			user_id, title, description, start_date, end_date,
			status, budget, trip_url, trip_code, trip_pass, trip_picture_url,
			visibility_status, planning_status
			)
			VALUES ($1, $2, NULL, $3, $4, NULL, NULL, NULL, $5, $6, $7, false, false)
			RETURNING *;
		`;

		const values = [user_id, title, start_date, end_date, trip_code, trip_pass, trip_picture_url ?? null];

		const result = await pool.query(sql, values);
		return (result.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
	},
	
	async delete_trip( trip_id:string, user_id:string ){
		const query = `DELETE FROM trips WHERE user_id = $1 AND trip_id = 2$`;
		const value = [trip_id, user_id];
		const result = await pool.query(query, value);
		return (result.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
	},

	async patch_trip_detail (user_id:string, trip_id:string){
		
	}
}