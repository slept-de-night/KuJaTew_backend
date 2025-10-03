import { pool } from '../../config/db';
import * as scheme from './docs.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';

export const DocsRepo = {
    async getTotalSize(trip_id: number) {
        const { rows } = await pool.query(
        "SELECT COALESCE(SUM(doc_size),0) as total_size FROM documents WHERE trip_id=$1",
        [trip_id]
        );
        return Number(rows[0].total_size);
    },

    async insertDocument(
        doc_name: string,
        path: string,
        doc_size: number,
        mem_type: string,
        trip_id: number
        ) {
        const query = `
            INSERT INTO documents (doc_name, path, doc_size, mem_type, modified, trip_id)
            VALUES ($1, $2, $3, $4, NOW(), $5)
            ON CONFLICT (trip_id, doc_name) 
            DO UPDATE SET 
            path = EXCLUDED.path,
            doc_size = EXCLUDED.doc_size,
            mem_type = EXCLUDED.mem_type,
            modified = NOW()
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [doc_name, path, doc_size, mem_type, trip_id]);
        const parsed = scheme.DocumentDBSchema.safeParse(rows[0]);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async check_role(user_id:string, trip_id:number){
        const query = `
            SELECT *
            FROM trip_collaborators
            WHERE trip_id = $1 AND user_id = $2 AND role IN ($3, $4)
        `
        const {rowCount} = await pool.query(query, [trip_id, user_id, 'Owner', 'Editor']);
        return rowCount;
    },

    async get_all_docs(trip_id: number){
        const query = `
            SELECT
                doc_id,
                doc_name,
                doc_size,
                mem_type as mimetype,
                modified
            FROM documents
            WHERE trip_id = $1
        `
        const schemalist = z.array(scheme.getalldoc);
        const {rows} = await pool.query(query, [trip_id]);
        const parsed = schemalist.safeParse(rows);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async get_path(doc_id:number){
        const query = `
            SELECT path
            FROM documents
            WHERE doc_id = $1
        `;
        const {rows} = await pool.query(query, [doc_id]);
        const parsed = z.object({path:z.string().min(1)}).safeParse(rows[0]);
        if (!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },

    async delete_doc(doc_id:number){
        const query = `
            DELETE
            FROM documents
            WHERE doc_id = $1
            RETURNING *
        `;
        const {rowCount} = await pool.query(query, [doc_id]);
        return rowCount;
    },
};