"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gbookmark_id_schema = exports.trip_id_schema = exports.bookmark_id_schema = exports.place_id_schema = void 0;
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
//# sourceMappingURL=bookmarks.schema.js.map