import { noteintripschema } from "./notes.schema";
import { pool } from "../../config/db";
import { date, z } from "zod";
import { INTERNAL, POSTGREST_ERR } from "../../core/errors";

export const NotesRepo = {
    async get_note_in_trip(trip_id:number, user_id:string){
        const query = `
            SELECT
                nt.note AS note,
                u.name AS name,
                u.profile_picture_path AS profile_picture_path,
                CASE WHEN u.user_id = $1 THEN 1 ELSE 0 END AS is_editable
            FROM note_in_trip nt
            JOIN trip_collaborators tc ON nt.collab_id = tc.collab_id
            JOIN users u ON tc.user_id = u.user_id
            WHERE nt.trip_id = $2
        `;
        const listscheme = z.array(noteintripschema);
        const {rows} = await pool.query(query, [user_id, trip_id]);
        console.log(rows);
        const parsed = listscheme.safeParse(rows);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async edit_trip_note(nit_id:number, note:string){
        const query = `
            UPDATE note_in_trip
            SET
                note = $1,
                note_time = $2
            WHERE nit_id = $3
            RETURNING *
        `
        const {rows} = await pool.query(query, [note, new Date(), nit_id]);
        return rows[0];
    },
}