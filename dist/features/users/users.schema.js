"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthSchema = exports.IdTokenSchema = exports.ProfileNullableSchema = exports.InvitedSchema = exports.ProfileFileSchema = exports.UsersFullSchema = exports.UserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.UserSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, 'name is required'),
    phone: zod_1.default.string().min(6, 'phone is too short'),
});
exports.UsersFullSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, 'name is required'),
    phone: zod_1.default.string(),
    email: zod_1.default.string(),
    user_id: zod_1.default.string(),
    profile_picture_path: zod_1.default.string().nullable()
});
exports.ProfileFileSchema = zod_1.default.object({
    fieldname: zod_1.default.literal('profile'),
    originalname: zod_1.default.string(),
    encoding: zod_1.default.string(),
    mimetype: zod_1.default.union([zod_1.default.literal('image/jpeg'), zod_1.default.literal('image/jpg'), zod_1.default.literal('image/png')]),
    buffer: zod_1.default.instanceof(Buffer),
    size: zod_1.default.number().max(5 * 1024 * 1024, 'Max 5MB'),
});
exports.InvitedSchema = zod_1.default.array(zod_1.default.object({
    trip_id: zod_1.default.number(),
    trip_name: zod_1.default.string(),
    trip_owner: zod_1.default.string(),
    start_date: zod_1.default.date(),
    end_date: zod_1.default.date(),
    trip_path: zod_1.default.string().optional(),
    poster_trip_url: zod_1.default.string().optional()
}));
exports.ProfileNullableSchema = exports.ProfileFileSchema.nullable();
exports.IdTokenSchema = zod_1.default.object({
    idToken: zod_1.default.string()
});
exports.GoogleAuthSchema = zod_1.default.object({
    iss: zod_1.default.string(),
    azp: zod_1.default.string(),
    aud: zod_1.default.string(),
    sub: zod_1.default.string(),
    email: zod_1.default.string(),
    email_verified: zod_1.default.boolean(),
    name: zod_1.default.string(),
    picture: zod_1.default.string(),
    given_name: zod_1.default.string(),
    //family_name:  z.string(),
    iat: zod_1.default.int(),
    exp: zod_1.default.int()
});
//# sourceMappingURL=users.schema.js.map