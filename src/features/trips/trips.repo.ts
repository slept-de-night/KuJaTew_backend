import { pool } from '../../config/db';
import { TripSchema, tripsumschema, pschema, guidebox } from './trips.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';

export const TripsRepo = {
	async get_user_trips(user_id:string){
		const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators
				WHERE accepted = TRUE
				GROUP BY trip_id
			),
				total_copied AS (
				SELECT trip_id, COUNT(user_id)::int AS total_copied
				FROM likes
				GROUP BY trip_id
			)
			SELECT
				t.trip_id,
				t.title,
				jp.joined_people,
				COALESCE(ttcp.total_copied, 0) AS total_copied,
				t.start_date,
				t.end_date,
				t.trip_picture_path AS poster_image_link,
				t.planning_status
			FROM trips t
			JOIN joinedP jp ON jp.trip_id = t.trip_id
			LEFT JOIN total_copied ttcp ON t.trip_id = ttcp.trip_id
			WHERE EXISTS (
				SELECT 1
				FROM trip_collaborators tc
				WHERE tc.trip_id = t.trip_id
					AND tc.user_id = $1
			);
		`;
		const TripsListSchema = z.array(TripSchema);
		const { rows } = await pool.query(query, [user_id]);
		const parsed = TripsListSchema.safeParse(rows);
		if (!parsed.success) throw INTERNAL("Fail to parsed data");
		return parsed.data;
	},

	async get_specific_trip(trip_id:number){
		const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators
				WHERE accepted = TRUE
				GROUP BY trip_id
			),
				total_copied AS (
				SELECT trip_id, COUNT(user_id)::int AS total_copied
				FROM likes
				GROUP BY trip_id
			)
			SELECT
				t.trip_id,
				t.title,
				jp.joined_people,
				COALESCE(ttcp.total_copied, 0) AS total_copied,
				t.start_date,
				t.end_date,
				t.trip_picture_path AS poster_image_link,
				t.planning_status
			FROM trips t
			JOIN joinedP jp ON jp.trip_id = t.trip_id
			LEFT JOIN total_copied ttcp ON t.trip_id = ttcp.trip_id
			WHERE EXISTS (
				SELECT 1
				FROM trip_collaborators tc
				WHERE tc.trip_id = t.trip_id
					AND tc.trip_id = $1
			);
		`;

		const { rows } = await pool.query(query,[trip_id]);
		const parsed = TripSchema.safeParse(rows[0]);
		if(!parsed.success) throw INTERNAL("Fail to parsed data");
		return parsed.data;
	},
	
	async create_trip_base(
		user_id:string,
		title:string,
		start_date:Date,
		end_date:Date,
		trip_code:string,
		trip_pass:string
	) {
		const query = `
			INSERT INTO trips (user_id, title, start_date, end_date, trip_code, trip_pass, visibility_status, planning_status, budget)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9)
			RETURNING *
		`;
		const values = [user_id, title, start_date, end_date, trip_code, trip_pass, false, false, 0];
		const result = await pool.query(query, values);
		return result.rows[0];
	},
	
	async update_trip_picture(trip_id:number, trip_picture_path:string){
		const query = `
			UPDATE trips
			SET
				trip_picture_path = $1
			WHERE trip_id = $2
			RETURNING *
		`
		const result = await pool.query(query, [trip_picture_path, trip_id]);
		return result.rowCount;
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
		const query = `
		DELETE 
		FROM trips 
		WHERE user_id = $1 AND trip_id = $2
		RETURNING *`;
		const value = [user_id, trip_id];
		const result = await pool.query(query, value);
		return result.rowCount;
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

	async edit_trip_detail(
		trip_id:number, 
		title?:string, 
		start_date?:Date, 
		end_date?:Date, 
		trip_code?:string, 
		trip_pass?:string, 
		trip_picture_url?:string, 
		planning_status?:boolean,
		visibility_status?:boolean,
		budget?:number, 
		description?:string
	){
		const query = `
			UPDATE trips
			SET 
				title = COALESCE($1, title),
				start_date = COALESCE($2, start_date),
				end_date = COALESCE($3, end_date),
				trip_code = COALESCE($4, trip_code),
				trip_pass = COALESCE($5, trip_pass),
				trip_picture_path = COALESCE($6, trip_picture_path),
				planning_status = COALESCE($7, planning_status),
				visibility_status = COALESCE($8, visibility_status),
				budget = COALESCE($9, budget),
				description = COALESCE($10, description)
			WHERE trip_id = $11
			RETURNING *
		`;

		const values = [
			title, 
			start_date, 
			end_date, 
			trip_code, 
			trip_pass, 
			trip_picture_url, 
			planning_status, 
			visibility_status,
			budget, 
			description, 
			trip_id
		];

		const result = await pool.query(query, values);
		return result.rows[0];
	},


	async get_trip_pic(trip_id:number){
		const query = `
			SELECT trip_picture_path
			FROM trips
			WHERE trip_id = $1
		`;
		const result = await pool.query(query, [trip_id]);
		return result.rows[0];

	},

	async change_owner_in_collab(role:string, collab_id?:number){
		const query = `
			UPDATE trip_collaborators
			SET
				role = $1
			WHERE collab_id = $2
			RETURNING *
		`;
		const result = await pool.query(query, [role, collab_id]);
		return result.rowCount;
	},

	async change_owner_in_trips(trip_id:number, member_id:string){
		const query = `
			UPDATE trips
			SET
				user_id = $1
			WHERE trip_id = $2
			RETURNING *
		`;
		const result = await pool.query(query, [member_id, trip_id]);
		return result.rowCount;
	},

	async leave_collab(user_id:string, trip_id:number){
		const query = `
			DELETE
			FROM trip_collaborators
			WHERE user_id = $1 AND trip_id = $2
			RETURNING *
		`;
		const result = await pool.query(query, [user_id, trip_id]);
		return result.rowCount;
	},

	async transferOwner(user_id: string, trip_id: number, collab_id: number) {
		const client = await pool.connect();
		try {
			await client.query("BEGIN");

			// delete old owner from collab table
			const lt = await client.query(
			`DELETE FROM trip_collaborators WHERE user_id = $1 AND trip_id = $2 RETURNING *`,
			[user_id, trip_id]
			);

			if (lt.rowCount !== 1) throw new Error("Leave collab failed");

			// set collab_id to be new owner
			const cco = await client.query(
			`UPDATE trip_collaborators SET role = 'Owner' WHERE collab_id = $1 RETURNING *`,
			[collab_id]
			);

			if (cco.rowCount !== 1) throw new Error("Change owner in collaborators failed");

			// set new owner in trips
			const member_id = (await client.query(
			`SELECT user_id FROM trip_collaborators WHERE collab_id = $1`,
			[collab_id]
			)).rows[0]?.user_id;

			if (!member_id) throw new Error("Member not found");

			const cto = await client.query(
			`UPDATE trips SET user_id = $1 WHERE trip_id = $2 RETURNING *`,
			[member_id, trip_id]
			);

			if (cto.rowCount !== 1) throw new Error("Change owner in trips failed");

			await client.query("COMMIT");
			return { success: true };

		} catch (err) {
			await client.query("ROLLBACK"); // undo all query
			throw err;
		} finally {
			client.release();
		}
	},

	async trip_sum(trip_id:number){
		const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators
				WHERE accepted = TRUE
				GROUP BY trip_id
			),
				total_copied AS (
				SELECT trip_id, COUNT(user_id)::int AS total_copied
				FROM likes
				GROUP BY trip_id
			)
			SELECT
				t.trip_id,
				t.title,
				jp.joined_people,
				COALESCE(ttcp.total_copied, 0) AS total_copied,
				t.start_date,
				t.end_date,
				t.trip_picture_path AS poster_image_link,
				t.budget,
				t.description as description
			FROM trips t
			JOIN joinedP jp ON jp.trip_id = t.trip_id
			LEFT JOIN total_copied ttcp ON t.trip_id = ttcp.trip_id
			WHERE EXISTS (
				SELECT 1
				FROM trip_collaborators tc
				WHERE tc.trip_id = t.trip_id
					AND tc.trip_id = $1
			);
		`;

		const {rows} = await pool.query(query, [trip_id]);
		const parsed = tripsumschema.safeParse(rows[0]);
		if (!parsed.success) throw INTERNAL("Fail to parsed query");
		return parsed.data;
	},

	async get_joinedP(trip_id:number){
		const query = `
			SELECT COUNT(user_id)::int AS joined_people
			FROM trip_collaborators tc
			WHERE tc.accepted = TRUE AND tc.trip_id = $1
			GROUP BY trip_id
		`;
		const {rows} = await pool.query(query, [trip_id]);
		const parsed = pschema.safeParse(rows[0]);
		if (!parsed.success) throw INTERNAL("Fail to parsed");
		return parsed.data.joined_people;
	},

	async get_recommended_trip(){
		const query = `
			WITH total_copied AS (
				SELECT trip_id, COUNT(user_id)::int AS total_copied
				FROM likes
				GROUP BY trip_id
			)
			SELECT
				t.trip_id,
				t.title,
				t.start_date,
				t.end_date,
				t.trip_picture_path AS guide_image,
				COALESCE(ttcp.total_copied, 0) AS total_copied,
				u.name as owner_name,
				u.profile_picture_path as owner_image,
				t.description as description
			FROM trips t
			JOIN users u ON u.user_id = t.user_id
			LEFT JOIN total_copied ttcp ON t.trip_id = ttcp.trip_id
			WHERE t.visibility_status = true
			ORDER BY total_copied desc
		`
		const {rows} = await pool.query(query);
		console.log(rows)
		const parsed = z.array(guidebox).safeParse(rows);
		if(!parsed.success) throw INTERNAL("Fail to parsed query");
		return parsed.data;
	},

	async get_invited_trips(user_id:string){
		const query =  `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators
				WHERE accepted = TRUE
				GROUP BY trip_id
			),
				total_copied AS (
				SELECT trip_id, COUNT(user_id)::int AS total_copied
				FROM likes
				GROUP BY trip_id
			)
			SELECT
				t.trip_id,
				t.title,
				jp.joined_people,
				COALESCE(ttcp.total_copied, 0) AS total_copied,
				t.start_date,
				t.end_date,
				t.trip_picture_path AS poster_image_link,
				t.planning_status
			FROM trips t
			JOIN joinedP jp ON jp.trip_id = t.trip_id
			LEFT JOIN total_copied ttcp ON t.trip_id = ttcp.trip_id
			WHERE EXISTS (
				SELECT 1
				FROM trip_collaborators tc
				WHERE tc.trip_id = t.trip_id AND tc.user_id = $1 AND tc.accepted = false
			);
		`;
		const { rows } = await pool.query(query, [user_id]);
		const parsed = z.array(TripSchema).safeParse(rows);
		if (!parsed.success) throw INTERNAL("Fail to parsed data");
		return parsed.data;
	},
}