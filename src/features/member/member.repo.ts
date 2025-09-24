import { pool } from '../../config/db';
import { MemberSchema, rSchema } from './member.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';
import { parse } from 'dotenv';

export const MemberRepo = {
	async get_trip_members( trip_id: number ){
		const query = `
			SELECT
				tc.collab_id,
				u.profile_picture_path as profile_picture_link,
				u.name,
				u.email,
				u.phone,
				tc.role
			FROM users u
			JOIN trip_collaborators tc ON u.user_id = tc.user_id
			WHERE tc.trip_id = $1
		`;
		const mls = z.array(MemberSchema);
		const {rows} = await pool.query(query, [trip_id]);
		const parsed = mls.safeParse(rows);
		if(!parsed.success) throw INTERNAL("Fail to parsed query");
		return parsed.data;
	},

	async is_in_trip( user_id: string, trip_id: number ){
		const query = `
			SELECT *
			FROM trip_collaborators
			WHERE user_id = $1 AND trip_id = $2
		`
		const result = await pool.query(query, [user_id, trip_id]);
		return result.rowCount; // 1 if in 0 if not
	},

	async edit_role ( role:string, trip_id:number, collab_id: number){
		const query = `
			UPDATE trip_collaborators
			SET
				role = $1
			WHERE collab_id = $2 AND trip_id = $3
			RETURNING *
		`;
		const result = await pool.query(query, [role, collab_id, trip_id]);
		return result.rows[0];
	},

	async delete_member ( collab_id:number, trip_id:number){
		const query = `
			DELETE
			FROM trip_collaborators
			WHERE collab_id = $1 AND trip_id = $2
			RETURNING *
		`;
		const {rows} = await pool.query(query, [collab_id, trip_id]);
		const parsed = MemberSchema.safeParse(rows[0]);
		if (!parsed.success) throw INTERNAL("Fail to parsed query");
		return parsed.data;
	},

	async get_memberid (trip_id:number){
		const query = `
			SELECT 
				user_id,
				role
			FROM trip_collaborators
			WHERE trip_id = $1
		`;
		const {rows} = await pool.query(query, [trip_id]);
		const urlist = z.array(rSchema);
		const parsed = urlist.safeParse(rows);
		if (!parsed.success) throw INTERNAL("Fail to parsed");
		return parsed.data;
	},
}