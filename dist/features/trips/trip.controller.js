"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip_Sum = exports.Leave_Trip = exports.Edit_Trip_Detail = exports.Delete_Trip = exports.Add_Trip = exports.Specific_Trip = exports.User_All_Trip = void 0;
const trips_service_1 = require("./trips.service");
const trips_schema_1 = require("./trips.schema");
const http_1 = require("../../core/http");
const errors_1 = require("../../core/errors");
const zod_1 = __importDefault(require("zod"));
exports.User_All_Trip = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.object({ user_id: zod_1.default.string() }).safeParse(req.user);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const trips_data = await trips_service_1.TripsService.get_user_trips(parsed.data.user_id);
    res.status(200).json(trips_data);
});
exports.Specific_Trip = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.string().transform(Number).safeParse((req.params.trip_id));
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const trip_data = await trips_service_1.TripsService.get_specific_trip(parsed.data);
    res.status(200).json(trip_data);
});
exports.Add_Trip = (0, http_1.asyncHandler)(async (req, res) => {
    try {
        const parsed = zod_1.default.object({ user_id: zod_1.default.string() }).safeParse(req.user);
        if (!parsed.success)
            throw (0, errors_1.BadRequest)("Invalide Request");
        const parsedbody = trips_schema_1.addtripSchema.safeParse(req.body);
        if (!parsedbody.success)
            throw (0, errors_1.BadRequest)("Invalid Body Request");
        const file = req.file;
        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new Error("Only JPEG, JPG, and PNG files are allowed");
            }
        }
        const body = parsedbody.data;
        const trip = await trips_service_1.TripsService.add_trip(parsed.data.user_id, body.trip_name, body.start_date, body.end_date, body.trip_code, body.trip_pass, file);
        return res.status(201).json(trip);
    }
    catch (err) {
        if (err.code === "23503")
            return res.status(404).json({ error: "User not found" });
        return res.status(400).json({ error: err.message });
    }
});
exports.Delete_Trip = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.object({ user_id: zod_1.default.string() }).safeParse(req.user);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const parsedtrip = trips_schema_1.tSchema.safeParse(req.params);
    if (!parsedtrip.success) {
        return res.status(400).json({ error: "Fail to parsed" });
    }
    const { user_id } = parsed.data;
    const { trip_id } = parsedtrip.data;
    const result = await trips_service_1.TripsService.delete_trip(user_id, trip_id);
    return res.status(204).json(result);
});
exports.Edit_Trip_Detail = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.object({ user_id: zod_1.default.string() }).safeParse(req.user);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const parsedtrip = trips_schema_1.tSchema.safeParse(req.params);
    if (!parsedtrip.success) {
        return res.status(400).json({ error: "Fail to parsed params" });
    }
    const parsedbody = trips_schema_1.BodySchema.safeParse(req.body);
    if (!parsedbody.success) {
        return res.status(400).json({ error: "Fail to parsed body" });
    }
    const { user_id } = parsed.data;
    const { trip_id } = parsedtrip.data;
    const { trip_name, start_date, end_date, trip_code, trip_pass, planning_status } = parsedbody.data;
    const file = req.file;
    if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error("Only JPEG, JPG, and PNG files are allowed");
        }
    }
    const result = await trips_service_1.TripsService.edit_trip_detail(user_id, trip_id, trip_name, start_date, end_date, trip_code, trip_pass, planning_status, file);
    return res.status(200).json(result);
});
exports.Leave_Trip = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.object({ user_id: zod_1.default.string() }).safeParse(req.user);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalide Request");
    const { user_id } = parsed.data;
    const parsedtrip = trips_schema_1.tSchema.safeParse(req.params);
    if (!parsedtrip.success) {
        return res.status(400).json({ error: "Fail to parsed params" });
    }
    const { trip_id } = parsedtrip.data;
    const parsedbody = trips_schema_1.cSchema.safeParse(req.body);
    if (!parsedbody.success) {
        return res.status(400).json({ error: "Fail to parsed body" });
    }
    const { collab_id } = parsedbody.data;
    const result = await trips_service_1.TripsService.leave_trip(user_id, trip_id, collab_id);
    return res.status(204).json(result);
});
exports.Trip_Sum = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = zod_1.default.string().transform(Number).safeParse((req.params.trip_id));
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalid Request");
    const tripID = parsed.data;
    const tripinfo = await trips_service_1.TripsService.trip_sum(tripID);
    return res.status(200).json(tripinfo);
});
//# sourceMappingURL=trip.controller.js.map