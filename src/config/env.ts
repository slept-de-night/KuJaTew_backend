import 'dotenv/config';
import z from 'zod';

const EnvSchema = z.object({
  PORT:z.string().default('3000'),
  SUPABASE_URL:z.string(),
  SUPABASE_KEY:z.string(),
  JWT_ACCESS_SECRET:z.string(),
  JWT_REFRESH_SECRET:z.string(),
  GOOGLE_ANDROID_CLIENT_ID:z.string(),
  GOOGLE_WEB_CLIENT_ID:z.string(),
  DATABASE_URL:z.string(),
  GOOGLE_PLACE_API_KEY:z.string()

});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid env:', parsed.error);
  process.exit(1);
}
export const env = parsed.data;
