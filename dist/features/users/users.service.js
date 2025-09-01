"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const users_repo_1 = require("./users.repo");
const errors_1 = require("../../core/errors");
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../../config/env");
const jwt_generator_1 = require("../../core/jwt,generator");
exports.UsersService = {
    async create_user(input, profile) {
        const created_user = await users_repo_1.UsersRepo.create_user(input);
        if (profile) {
            const upload_profile = await users_repo_1.UsersRepo.upload_profile(profile, created_user.user_id);
            await users_repo_1.UsersRepo.update_profile_path(upload_profile.fullPath, created_user.user_id);
            const profile_link = await users_repo_1.UsersRepo.get_file_link(upload_profile.fullPath, "profiles", 3600);
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
        const profile_link = await users_repo_1.UsersRepo.get_file_link(user_data.profile_picture_path, "profiles", 3600);
        return { ...remians, 'profile_picture_link': profile_link.signedUrl };
    },
    async update_user(input, user_id, profile) {
        const created_user = await users_repo_1.UsersRepo.update_user(input);
        if (profile) {
            const upload_profile = await users_repo_1.UsersRepo.upload_profile(profile, user_id);
            await users_repo_1.UsersRepo.update_profile_path(upload_profile.fullPath, user_id);
            const profile_link = await users_repo_1.UsersRepo.get_file_link(upload_profile.fullPath, "profiles", 3600);
        }
    },
};
//# sourceMappingURL=users.service.js.map