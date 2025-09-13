import { Pool, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false }, // uncomment if your provider needs SSL
});

/**
 * Typed query helper.
 * Usage:
 *   type Row = { id: string; name: string };
 *   const res = await query<Row>("SELECT id, name FROM users WHERE id=$1", [id]);
 *   res.rows[0].name // typed as string
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const res = await pool.query<T>(text, params);
  return res; // res.rows is T[], res.rowCount is number | null
}
