"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepo = void 0;
const db_1 = require("../../config/db");
const users_schema_1 = require("./users.schema");
const errors_1 = require("../../core/errors");
const crypto_1 = __importDefault(require("crypto"));
exports.UsersRepo = {
    async create_user(data) {
        const user_data = { user_id: crypto_1.default.randomUUID(), ...data, profile_picture_path: null };
        console.log(user_data);
        const { error } = await db_1.supabase.from('users').insert(user_data);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        return user_data;
    },
    async upload_profile(profile, uuid) {
        console.log(profile);
        const contentType = profile.mimetype || 'application/octet-stream';
        const path = uuid + '_profile';
        const { data, error } = await db_1.supabase.storage.from('profiles').upload(path, profile.buffer, {
            contentType,
            cacheControl: '3600',
            upsert: true,
        });
        if (error)
            throw (0, errors_1.STORAGE_ERR)(error);
        return data;
    },
    async update_profile_path(path, user_id) {
        const { error } = await db_1.supabase.from('users').update({ 'profile_picture_path': path }).eq('user_id', user_id);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        return path;
    },
    async get_user_details(user_id) {
        const { data, error } = await db_1.supabase.from('users').select("*").eq("user_id", user_id);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        const parsed = users_schema_1.UsersFullSchema.safeParse(data);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("Can't Parsed data");
        return parsed.data;
    },
    async get_file_link(path, bucket, duration) {
        const { data, error } = await db_1.supabase.storage.from(bucket).createSignedUrl(path, duration);
        if (error)
            throw (0, errors_1.STORAGE_ERR)(error);
        return data;
    },
    async update_user(user_data) {
        console.log(user_data);
        if (user_data.name) {
            const { error } = await db_1.supabase.from('users').update({ "name": user_data.name });
            if (error)
                throw (0, errors_1.POSTGREST_ERR)(error);
        }
        if (user_data.phone) {
            const { error } = await db_1.supabase.from('users').update({ "email": user_data.phone });
            if (error)
                throw (0, errors_1.POSTGREST_ERR)(error);
        }
    },
};
//# sourceMappingURL=users.repo.js.map