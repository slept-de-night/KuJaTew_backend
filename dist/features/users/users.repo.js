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
        console.log(path);
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
        console.log(data);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        if (data.length != 1) {
            console.log("user id have exist same value");
        }
        const parsed = users_schema_1.UsersFullSchema.safeParse(data[0]);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("Can't Parsed data");
        return parsed.data;
    },
    async get_user_details_byemail(email) {
        const { data, error } = await db_1.supabase.from('users').select("*").eq("email", email);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        console.log(data[0]);
        const parsed = users_schema_1.UsersFullSchema.safeParse(data[0]);
        console.log(parsed.data);
        if (!parsed.success)
            return null;
        return parsed.data;
    },
    async get_file_link(path, bucket, duration) {
        const { data, error } = await db_1.supabase.storage.from(bucket).createSignedUrl(path, duration);
        if (error)
            throw (0, errors_1.STORAGE_ERR)(error);
        return data;
    },
    async update_user(user_data, user_id) {
        console.log(user_data);
        if (user_data.name) {
            const { error } = await db_1.supabase.from('users').update({ "name": user_data.name }).eq('user_id', user_id);
            if (error)
                throw (0, errors_1.POSTGREST_ERR)(error);
        }
        if (user_data.phone) {
            const { error } = await db_1.supabase.from('users').update({ "phone": user_data.phone }).eq('user_id', user_id);
            if (error)
                throw (0, errors_1.POSTGREST_ERR)(error);
        }
    },
    async is_name_exist(name) {
        const { data, error } = await db_1.supabase.from('users').select('name').eq('name', name);
        if (error)
            throw (0, errors_1.POSTGREST_ERR)(error);
        if (data.length > 0) {
            return true;
        }
        return false;
    },
    async get_invited(user_id) {
        const query = "WITH invited_trip AS (SELECT a.trip_id FROM trip_collaborators a WHERE a.user_id = $1 AND a.accepted = False)\
            SELECT b.trip_id,b.title,b.start_date,b.end_date,c.name AS owner_name,b.trip_path FROM invited_trip a JOIN trips b \
            ON a.trip_id = b.trip_id JOIN users c ON b.user_id = c.user_id";
        const result = await db_1.pool.query(query, [user_id]);
        const data = users_schema_1.InvitedSchema.safeParse(result.rows);
        if (!data.success)
            throw (0, errors_1.INTERNAL)("Fail to parsed data");
        return data.data;
    }
};
//# sourceMappingURL=users.repo.js.map