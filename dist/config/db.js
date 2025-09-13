"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.supabase = void 0;
const env_1 = require("./env");
const supabase_js_1 = require("@supabase/supabase-js");
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
exports.supabase = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_KEY);
exports.pool = new Pool({
    connectionString: env_1.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, //
    },
});
//# sourceMappingURL=db.js.map