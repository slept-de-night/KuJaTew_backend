"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFlightBodySchema = exports.TripParamsSchema = exports.trip_flight_schema = exports.flight_id_schema = exports.trip_id_schema = void 0;
const zod_1 = require("zod");
exports.trip_id_schema = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().min(1, "trip_id is required"),
});
exports.flight_id_schema = zod_1.z.object({
    flight_id: zod_1.z.coerce.number().min(1, "trip_id is required"),
});
exports.trip_flight_schema = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().min(1, "trip_id is required"),
    flight_id: zod_1.z.coerce.number().min(1, "trip_id is required"),
});
exports.TripParamsSchema = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
});
// DD/MM/YYYY
const DateDDMMYYYY = zod_1.z.string().regex(/^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/, "Expected DD/MM/YYYY");
// HH:mm 24-hour
const TimeHHMM = zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Expected HH:mm");
const IATA = zod_1.z.string().length(3, "3-letter IATA code");
const CountryFull = zod_1.z.string().min(2).max(56); // full name like "Thailand"
exports.CreateFlightBodySchema = zod_1.z.object({
    dep_date: DateDDMMYYYY,
    dep_time: TimeHHMM,
    dep_country: CountryFull,
    dep_airp_code: IATA,
    arr_date: DateDDMMYYYY,
    arr_time: TimeHHMM,
    arr_country: CountryFull,
    arr_airp_code: IATA,
    airl_name: zod_1.z.string().min(2).max(64), // airline name
});
//# sourceMappingURL=flights.schema.js.map