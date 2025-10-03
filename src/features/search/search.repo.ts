import { pool } from '../../config/db';
import {guideschema, userschema} from './search.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';

export const searchRepo = {
    async search_user(username:string){
        const query = `
            SELECT
                user_id as user_id,
                name as username,
                email as email,
                phone as phone,
                profile_picture_path as profile_picture_link
            FROM users
            WHERE name ILIKE '%' || $1 || '%'
            LIMIT 5;
        `
        const userschemalist = z.array(userschema);
        const {rows} = await pool.query(query, [username]);
        const parsed = userschemalist.safeParse(rows);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async member_userid(trip_id:number){
        const query = `
            SELECT
                tc.user_id as user_id
            FROM trips t
            JOIN trip_collaborators tc ON t.trip_id = tc.trip_id
            WHERE tc.trip_id = $1
        `
        const {rows} = await pool.query(query, [trip_id]);
        const parsed = z.array(z.object({user_id:z.string()})).safeParse(rows);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async search_guide(guide_name:string){
        const query = `
            WITH total_copied AS (
				SELECT trip_id, COUNT(user_id)::int AS total_copied
				FROM likes
				GROUP BY trip_id
			)
            SELECT
                t.trip_id as trip_id,
                t.title as guide_name,
                COALESCE(ttcp.total_copied, 0) AS total_copied,
                t.start_date as start_date,
                t.end_date as end_date,
                u.name as owner_name,
                u.profile_picture_path as owner_image,
                t.trip_picture_path as guide_poster_link
            FROM trips t
            JOIN users u ON t.user_id = u.user_id
			LEFT JOIN total_copied ttcp ON t.trip_id = ttcp.trip_id
            WHERE t.title ILIKE '%' || $1 || '%' AND t.visibility_status = true
            LIMIT 5;
        `;

        const guideschemalist = z.array(guideschema);
        const {rows} = await pool.query(query, [guide_name]);
        console.log(rows)
        const parsed = guideschemalist.safeParse(rows);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },
}