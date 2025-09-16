"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripUpdateSchema = exports.TripCreateSchema = exports.pschema = exports.tripsumschema = exports.addtripSchema = exports.cSchema = exports.BodySchema = exports.mrSchema = exports.tSchema = exports.TripSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.TripSchema = zod_1.default.object({
    trip_id: zod_1.default.number(),
    title: zod_1.default.string(),
    joined_people: zod_1.default.number(),
    start_date: zod_1.default.date(),
    end_date: zod_1.default.date(),
    poster_image_link: zod_1.default.string().nullable(),
    planning_status: zod_1.default.boolean()
});
exports.tSchema = zod_1.default.object({
    trip_id: zod_1.default.coerce.number().int().positive("trip_id must be a positive integer"),
});
exports.mrSchema = zod_1.default.object({
    member_id: zod_1.default.string().trim().min(1, "user_id required"),
    role: zod_1.default.string().trim().min(1, "role required"),
});
exports.BodySchema = zod_1.default.object({
    trip_name: zod_1.default.string().optional(),
    start_date: zod_1.default.date().optional(),
    end_date: zod_1.default.date().optional(),
    trip_code: zod_1.default.string().optional(),
    trip_pass: zod_1.default.string().optional(),
    planning_status: zod_1.default.boolean().optional()
});
exports.cSchema = zod_1.default.object({
    collab_id: zod_1.default.number().optional(),
});
exports.addtripSchema = zod_1.default.object({
    trip_name: zod_1.default.string().trim().min(1),
    start_date: zod_1.default.coerce.date(),
    end_date: zod_1.default.coerce.date(),
    trip_code: zod_1.default.string().trim().min(1, "trip_code required"),
    trip_pass: zod_1.default.string().trim().min(1, "trip_pass required"),
});
exports.tripsumschema = zod_1.default.object({
    trip_id: zod_1.default.number(),
    title: zod_1.default.string(),
    joined_people: zod_1.default.number(),
    start_date: zod_1.default.date(),
    end_date: zod_1.default.date(),
    budget: zod_1.default.number(),
    poster_image_link: zod_1.default.string().nullable(),
});
exports.pschema = zod_1.default.object({
    joined_people: zod_1.default.number()
});
exports.TripCreateSchema = zod_1.default.object({
    trip_name: zod_1.default.string(),
    start_date: zod_1.default.date(),
    end_date: zod_1.default.date(),
    trip_code: zod_1.default.string(),
    trip_pass: zod_1.default.string(),
});
exports.TripUpdateSchema = zod_1.default.object({
    trip_name: zod_1.default.string().default(""),
    start_date: zod_1.default.date().default(() => new Date()),
    end_date: zod_1.default.date().default(() => new Date()),
    trip_code: zod_1.default.string().default(""),
    trip_pass: zod_1.default.string().default(""),
    trip_image: zod_1.default.string().openapi({ type: "string", format: "binary" }).optional(),
});
//# sourceMappingURL=trips.schema.js.map