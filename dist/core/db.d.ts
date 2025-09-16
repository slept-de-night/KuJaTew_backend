import { Pool, QueryResult, QueryResultRow } from "pg";
export declare const pool: Pool;
/**
 * Typed query helper.
 * Usage:
 *   type Row = { id: string; name: string };
 *   const res = await query<Row>("SELECT id, name FROM users WHERE id=$1", [id]);
 *   res.rows[0].name // typed as string
 */
export declare function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>>;
//# sourceMappingURL=db.d.ts.map