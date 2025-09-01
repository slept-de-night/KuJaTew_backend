"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const env_1 = require("./env");
const supabase_js_1 = require("@supabase/supabase-js");
exports.supabase = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_KEY);
//# sourceMappingURL=db.js.map