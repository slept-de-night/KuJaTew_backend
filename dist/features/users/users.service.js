"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
exports.downloadToProfileFile = downloadToProfileFile;
const users_repo_1 = require("./users.repo");
const errors_1 = require("../../core/errors");
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../../config/env");
const jwt_generator_1 = require("../../core/jwt,generator");
const node_path_1 = __importDefault(require("node:path"));
exports.UsersService = {
    async create_user(input, profile) {
        const created_user = await users_repo_1.UsersRepo.create_user(input);
        if (profile) {
            const upload_profile = await users_repo_1.UsersRepo.upload_profile(profile, created_user.user_id);
            console.log(upload_profile.fullPath);
            await users_repo_1.UsersRepo.update_profile_path(upload_profile.path, created_user.user_id);
            created_user.profile_picture_path = upload_profile.path;
            const profile_link = await users_repo_1.UsersRepo.get_file_link(upload_profile.path, "profiles", 3600);
            return { ...created_user, profile_picture_link: profile_link.signedUrl };
        }
        return { ...created_user, profile_picture_link: "" };
    },
    async google_verify(idToken) {
        const googleClient = new google_auth_library_1.OAuth2Client("999598547228-cgjn9gspjg2d1m2m2q3rp277ovl58qhb.apps.googleusercontent.com");
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: ["999598547228-cgjn9gspjg2d1m2m2q3rp277ovl58qhb.apps.googleusercontent.com"], // include all that your app uses
        });
        const payload = ticket.getPayload();
        if (!payload)
            throw (0, errors_1.BadRequest)("Invalid token");
        if (env_1.env.GOOGLE_ANDROID_CLIENT_ID != payload.azp)
            throw (0, errors_1.BadRequest)("Invalid Application Request");
        console.log(payload);
        return payload;
    },
    async gen_jwt(user_id) {
        const acc_tk = (0, jwt_generator_1.gen_jwt_token)(env_1.env.JWT_ACCESS_SECRET, { "user_id": user_id }, '1h');
        const ref_tk = (0, jwt_generator_1.gen_jwt_token)(env_1.env.JWT_REFRESH_SECRET, { "user_id": user_id }, '30d');
        return { Access_token: acc_tk, Refresh_token: ref_tk };
    },
    async get_user_details(user_id) {
        const user_data = await users_repo_1.UsersRepo.get_user_details(user_id);
        const { profile_picture_path, ...remians } = user_data;
        if (user_data.profile_picture_path) {
            console.log("ggg");
            const profile_link = await users_repo_1.UsersRepo.get_file_link(user_data.profile_picture_path, "profiles", 3600);
            return { ...remians, 'profile_picture_link': profile_link.signedUrl };
        }
        else {
            return { ...remians, 'profile_picture_link': "" };
        }
    },
    async update_user(input, user_id, profile) {
        await users_repo_1.UsersRepo.update_user(input, user_id);
        if (profile) {
            const upload_profile = await users_repo_1.UsersRepo.upload_profile(profile, user_id);
            await users_repo_1.UsersRepo.update_profile_path(upload_profile.fullPath, user_id);
        }
    },
    async get_user_details_byemail(email) {
        const user_data = await users_repo_1.UsersRepo.get_user_details_byemail(email);
        if (!user_data)
            return null;
        console.log(user_data);
        const { profile_picture_path, ...remians } = user_data;
        const profile_link = await users_repo_1.UsersRepo.get_file_link(user_data.profile_picture_path, "profiles", 3600);
        return { ...remians, 'profile_picture_link': profile_link.signedUrl };
    },
    async gen_name(name) {
        const min = 1;
        const max = 10000;
        let check_name = name;
        while (users_repo_1.UsersRepo.is_name_exist(check_name)) {
            const randomIntInRange = Math.floor(Math.random() * (max - min + 1)) + min;
            check_name = name + randomIntInRange.toString();
        }
        return check_name;
    },
    async get_invited(user_id) {
        const invited_list = await users_repo_1.UsersRepo.get_invited(user_id);
        await invited_list.forEach(async (element) => {
            if (element.trip_path) {
                element.poster_trip_url = (await users_repo_1.UsersRepo.get_file_link(element.trip_path, "poster", 3600)).signedUrl;
            }
            else {
                element.poster_trip_url = "";
            }
        });
        return invited_list;
    },
};
async function downloadToProfileFile(rawUrl) {
    const url = rawUrl;
    const resp = await fetch(url, { redirect: "follow" });
    if (!resp.ok) {
        throw new Error(`Download failed: ${resp.status} ${resp.statusText}`);
    }
    const mimetype = resp.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const cd = resp.headers.get("content-disposition");
    let filenameFromHeader = null;
    if (cd) {
        const m = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
        if (m?.[2])
            filenameFromHeader = m[2];
    }
    const urlBase = (() => {
        try {
            return node_path_1.default.posix.basename(new URL(url).pathname) || null;
        }
        catch {
            return null;
        }
    })();
    const ext = mimetype || ".jpg";
    const base = filenameFromHeader ??
        urlBase ??
        crypto.randomUUID() + ext;
    const originalname = base.includes(".") ? base : `${base}${ext}`;
    const file = {
        fieldname: "profile",
        originalname,
        encoding: "7bit",
        mimetype: mimetype.toLowerCase(),
        buffer,
        size: buffer.length,
    };
    return file;
}
//# sourceMappingURL=users.service.js.map