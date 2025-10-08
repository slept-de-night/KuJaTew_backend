import { noteintripschema, noteactivityschema } from "./notes.schema";
import { pool } from "../../config/db";
import { date, z } from "zod";
import { INTERNAL, POSTGREST_ERR } from "../../core/errors";
import { error } from "node:console";
import multer from "multer";
import th from "zod/v4/locales/th.js";

export const NotesRepo = {
// intersection part
    async get_collabID(user_id:string, trip_id:number){
        const query1 = `
            SELECT collab_id
            FROM trip_collaborators
            WHERE user_id = $1 AND trip_id = $2
        `;
        const {rows} = await pool.query(query1, [user_id, trip_id]);
        const parsed = z.object({collab_id:z.coerce.number()}).safeParse(rows[0]);
        if (!parsed.success) throw INTERNAL("Fail to parsed collab_id");
        return parsed.data;
    },

    async is_creator(collab_id:number, nit_id:number){
        const query = `
            SELECT *
            FROM note_in_trip
            WHERE nit_id = $1 AND collab_id = $2
        `;
        const {rowCount} = await pool.query(query, [nit_id, collab_id]);
        return rowCount;
    },

    async is_creator2(collab_id:number, pnote_id:number){
        const query = `
            SELECT *
            FROM note
            WHERE pnote_id = $1 and collab_id = $2
        `
        const {rowCount} = await pool.query(query, [pnote_id, collab_id]);
        return rowCount;
    },

// overview part
    async get_overview_notes(trip_id:number, user_id:string){
        const query = `
            SELECT
                nt.nit_id as nit_id,
                nt.note AS note,
                u.name AS name,
                u.user_id as user_id,
                u.profile_picture_path AS profile_picture_path,
                CASE WHEN u.user_id = $1 THEN 1 ELSE 0 END AS is_editable,
                nt.note_time as note_time
            FROM note_in_trip nt
            JOIN trip_collaborators tc ON nt.collab_id = tc.collab_id
            JOIN users u ON tc.user_id = u.user_id
            WHERE nt.trip_id = $2
        `;
        const listscheme = z.array(noteintripschema);
        const {rows} = await pool.query(query, [user_id, trip_id]);
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

    async check_nit(collab_id:number, trip_id:number){
        const query = `
            SELECT COUNT(*)::int as total_note
            FROM note_in_trip
            WHERE trip_id = $1 AND collab_id = $2
        `;
        const {rows} = await pool.query(query, [trip_id, collab_id]);
        const parsed1 = z.object({total_note:z.coerce.number()}).safeParse(rows[0]);
        if (!parsed1.success) throw INTERNAL("Fail to parsed collab_id");
        return parsed1.data;
    },

    async add_overview_note(collab_id:number, trip_id:number, note:string){
        const query = `
            INSERT INTO note_in_trip(trip_id, collab_id, note, note_time)
            VALUES ($1,$2,$3,$4)
            RETURNING *
        `
        const {rows} = await pool.query(query, [trip_id, collab_id, note, new Date()]);
        return rows;
    },

    async delete_overview_note(collab_id:number, nit_id:number){
        const del = `
            DELETE
            FROM note_in_trip
            WHERE nit_id = $1 AND collab_id = $2
            RETURNING *
        `;
        const {rows} = await pool.query(del,[nit_id, collab_id]);
        return rows;
    },

// activity note part
    async get_activity_notes(trip_id:number, collab_id:number){
        const query = `
            SELECT
                n.pnote_id as pnote_id,
                n.note as note,
                n.pit_id as pit_id,
                u.name AS name,
                u.profile_picture_path AS profile_picture_path,
                CASE WHEN n.collab_id = $1 THEN 1 ELSE 0 END AS is_editable
            FROM note n
            JOIN trip_collaborators tc ON n.collab_id = tc.collab_id
            JOIN users u ON u.user_id = tc.user_id
            WHERE n.trip_id = $2
        `;
        const listscheme = z.array(noteactivityschema);
        const {rows} = await pool.query(query, [collab_id, trip_id]);
        const parsed = listscheme.safeParse(rows);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    }, 

    async edit_activity_note(pnote_id:number, note:string){
        const query = `
            UPDATE note
            SET
                note = $1,
                note_time = $2
            WHERE pnote_id = $3
            RETURNING *
        `;
        const {rows} = await pool.query(query, [note, new Date(), pnote_id]);
        return rows[0];
    },

    async check_n(collab_id:number, trip_id:number, pit_id:number){
        const query = `
            SELECT COUNT(*)::int as total_note
            FROM note
            WHERE trip_id = $1 AND collab_id = $2 AND pit_id = $3
        `;
        const {rows} = await pool.query(query, [trip_id, collab_id, pit_id]);
        const parsed1 = z.object({total_note:z.coerce.number()}).safeParse(rows[0]);
        if (!parsed1.success) throw INTERNAL("Fail to parsed collab_id");
        return parsed1.data;
    },

    async add_activity_note(collab_id:number, trip_id:number, note:string, pit_id:number){
        const query = `
            INSERT INTO note(trip_id, collab_id, pit_id, note, note_time)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
        `
        const {rows} = await pool.query(query, [trip_id, collab_id, pit_id, note, new Date()]);
        return rows[0];
    },

    async delete_activity_note(collab_id:number, pnote_id:number){
        const del = `
            DELETE
            FROM note
            WHERE pnote_id = $1 AND collab_id = $2
            RETURNING *
        `;
        const {rows} = await pool.query(del,[pnote_id, collab_id]);
        return rows[0];
    },
}