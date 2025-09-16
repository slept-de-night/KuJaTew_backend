"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_flight = get_flight;
exports.delete_flight = delete_flight;
exports.post_flight = post_flight;
exports.put_flight = put_flight;
const service = __importStar(require("./flights.service"));
const schema = __importStar(require("./flights.schema"));
const zod_1 = require("zod");
const TEST_USER_ID = "OSHI";
async function get_flight(req, res, next) {
    try {
        const { trip_id } = schema.trip_id_schema.parse(req.params);
        const flights = await service.get_flight(trip_id);
        return res.status(200).json({ flights });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function delete_flight(req, res, next) {
    try {
        const user_id = TEST_USER_ID;
        const { trip_id, flight_id } = schema.trip_flight_schema.parse(req.params);
        const deleted = await service.delete_flight(user_id, trip_id, flight_id);
        if (!deleted) {
            return res.status(404).json({ message: "flight not found" });
        }
        return res.status(200).json({ message: "flight removed" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function post_flight(req, res, next) {
    try {
        const user_id = TEST_USER_ID;
        const { trip_id } = schema.trip_id_schema.parse(req.params);
        const body = schema.CreateFlightBodySchema.parse(req.body);
        const row = await service.post_flight(user_id, body, trip_id);
        return res.status(201).json(row);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function put_flight(req, res, next) {
    try {
        const user_id = TEST_USER_ID;
        const { trip_id, flight_id } = schema.trip_flight_schema.parse(req.params);
        const body = schema.CreateFlightBodySchema.parse(req.body);
        const row = await service.put_flight(user_id, body, trip_id, flight_id);
        return res.status(201).json(row);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
//# sourceMappingURL=flights.controller.js.map