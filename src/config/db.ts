import {env} from './env';
import { createClient } from '@supabase/supabase-js'
import pkg from "pg";

const { Pool } = pkg;

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, //
  },
});

