"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trip_code_password_schema = exports.user_name_schema = exports.gbookmark_id_schema = exports.trip_id_schema = exports.bookmark_id_schema = exports.place_id_schema = void 0;
const zod_1 = require("zod");
exports.place_id_schema = zod_1.z.object({
    place_id: zod_1.z.coerce.number().min(1, "place_id is required"),
});
exports.bookmark_id_schema = zod_1.z.object({
    bookmark_id: zod_1.z.coerce.number().min(1, "place_id is required"),
});
exports.trip_id_schema = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().min(1, "trip_id is required"),
});
exports.gbookmark_id_schema = zod_1.z.object({
    gbookmark_id: zod_1.z.coerce.number().min(1, "trip_id is required"),
});
exports.user_name_schema = zod_1.z.object({
    name: zod_1.z.string().min(1, "invited user must have name"),
});
exports.trip_code_password_schema = zod_1.z.object({
    trip_code: zod_1.z.string().min(1, "invited user must have name"),
    trip_pass: zod_1.z.string().min(1, "invited user must have name"),
});
//# sourceMappingURL=invitations.schema.js.map