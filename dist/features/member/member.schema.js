"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urSchema = exports.roleSchema = exports.utcSchema = exports.utSchema = exports.MemberSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.MemberSchema = zod_1.default.object({
    collab_id: zod_1.default.number(),
    profile_picture_link: zod_1.default.string(),
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    phone: zod_1.default.string(),
    role: zod_1.default.string()
});
exports.utSchema = zod_1.default.object({
    trip_id: zod_1.default.coerce.number().int().positive("trip_id must be a positive integer"),
    user_id: zod_1.default.string().trim().min(1, "user_id required"),
});
exports.utcSchema = zod_1.default.object({
    trip_id: zod_1.default.coerce.number().int().positive("trip_id must be a positive integer"),
    user_id: zod_1.default.string().trim().min(1, "user_id required"),
    collab_id: zod_1.default.coerce.number().int().positive("trip_id must be a positive integer"),
});
exports.roleSchema = zod_1.default.object({
    collab_id: zod_1.default.number().int(),
    role: zod_1.default.string().trim()
});
exports.urSchema = zod_1.default.object({
    user_id: zod_1.default.string().trim().min(1, "user_id required"),
    role: zod_1.default.string().trim()
});
//# sourceMappingURL=member.schema.js.map