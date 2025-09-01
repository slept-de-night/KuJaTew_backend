"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = __importDefault(require("zod"));
const EnvSchema = zod_1.default.object({
    PORT: zod_1.default.string().default('3000'),
    SUPABASE_URL: zod_1.default.string(),
    SUPABASE_KEY: zod_1.default.string(),
    JWT_ACCESS_SECRET: zod_1.default.string(),
    JWT_REFRESH_SECRET: zod_1.default.string(),
    GOOGLE_ANDROID_CLIENT_ID: zod_1.default.string(),
    GOOGLE_WEB_CLIENT_ID: zod_1.default.string()
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid env:', parsed.error);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map