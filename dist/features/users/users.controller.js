"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.getinviteds = exports.getTokenRefresh = exports.Users_Details = exports.updateUser = void 0;
const users_service_1 = require("./users.service");
const users_schema_1 = require("./users.schema");
const http_1 = require("../../core/http");
const errors_1 = require("../../core/errors");
const zod_1 = __importDefault(require("zod"));
exports.updateUser = (0, http_1.asyncHandler)(async (req, res) => {
    let upload_profile = {};
    const body_parsed = users_schema_1.UserSchema.safeParse(req.body);
    if (!body_parsed.success)
        throw (0, errors_1.BadRequest)("Request Structure is not invalide!");
    if (!req.file)
        console.log("Profile File not exist");
    const file_parsed = users_schema_1.ProfileFileSchema.safeParse(req.file);
    if (!file_parsed.success)
        throw (0, errors_1.BadRequest)("Request File is not invalide!");
    await users_service_1.UsersService.update_user({ ...body_parsed.data }, req.user.user_id, file_parsed.data ?? null);
    res.status(200).json({ mes: "updated user success!" });
});
exports.Users_Details = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.string().safeParse((req.params.user_id));
    console.log(req.params.user_id);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const user_data = await users_service_1.UsersService.get_user_details(parsed.data);
    console.log(user_data);
    res.status(201).json(user_data);
});
exports.getTokenRefresh = (0, http_1.asyncHandler)(async (req, res) => {
    console.log("hello");
    const parsed = zod_1.default.object({ user_id: zod_1.default.string() }).safeParse(req.user);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const token = await users_service_1.UsersService.gen_jwt(parsed.data.user_id);
    res.status(200).json(token);
});
exports.getinviteds = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.object({ user_id: zod_1.default.string() }).safeParse(req.user);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const invited_list = await users_service_1.UsersService.get_invited(parsed.data.user_id);
    res.status(200).json({ invited: invited_list });
});
exports.loginUser = (0, http_1.asyncHandler)(async (req, res) => {
    const body_parsed = users_schema_1.IdTokenSchema.safeParse(req.body);
    if (!body_parsed.success)
        throw (0, errors_1.BadRequest)("Request Structure is not invalide!");
    console.log(body_parsed.data.idToken);
    const payload = await users_service_1.UsersService.google_verify(body_parsed.data.idToken);
    const parsed_payload = users_schema_1.GoogleAuthSchema.safeParse(payload);
    if (!parsed_payload.success)
        throw (0, errors_1.INTERNAL)("Payload Can not parsed");
    const old_data = await users_service_1.UsersService.get_user_details_byemail(parsed_payload.data.email);
    if (old_data != null) {
        const token = await users_service_1.UsersService.gen_jwt(old_data.user_id);
        res.status(200).json({ ...old_data, ...token });
    }
    else {
        const profile = await (0, users_service_1.downloadToProfileFile)(parsed_payload.data.picture);
        console.log(profile);
        const profile_parsed = users_schema_1.ProfileFileSchema.safeParse(profile);
        if (!profile_parsed.success)
            console.log("Fail to retrive profile picture");
        console.log(profile_parsed.data);
        const unique_name = await users_service_1.UsersService.gen_name(parsed_payload.data.name);
        const user = await users_service_1.UsersService.create_user({ email: parsed_payload.data.email, phone: "",
            name: unique_name }, profile_parsed.data ?? null);
        const token = await users_service_1.UsersService.gen_jwt(user.user_id);
        res.status(201).json({ ...user, ...token });
    }
});
//# sourceMappingURL=users.controller.js.map