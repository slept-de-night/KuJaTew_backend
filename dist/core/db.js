"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env");
}
exports.pool = new pg_1.Pool({
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
async function query(text, params) {
    const res = await exports.pool.query(text, params);
    return res; // res.rows is T[], res.rowCount is number | null
}
//# sourceMappingURL=db.js.map