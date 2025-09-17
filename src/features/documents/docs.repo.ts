import { pool } from '../../config/db';
import { docSchema } from './docs.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';

export const DocsRepo = {
    async get_docs(trip_id:number){
        const query = `
            SELECT
                doc_id as doc_id,
                doc_name as doc_name,
                mem_type as mimetype,
                doc_size as doc_size,
                modified as modified_at
            FROM documents
            WHERE trip_id = $1
        `;
        const dls = z.array(docSchema);
        const {rows} = await pool.query(query, [trip_id]);
        const parsed = dls.safeParse(rows);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },
}