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
exports.VoteController = exports.PlaceController = exports.EventController = exports.ActivityController = void 0;
const activity_service_1 = require("./activity.service");
const S = __importStar(require("./activity.schema"));
const zod_1 = require("zod");
// -------- Activities --------
exports.ActivityController = {
    listAll: async (req, res, next) => {
        try {
            const { trip_id } = S.ParamsTrip.parse(req.params);
            const result = await activity_service_1.ActivityService.listAll(trip_id);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            }
            next(err);
        }
    },
    list: async (req, res, next) => {
        try {
            const { trip_id, date } = S.GetActivitiesByDateParams.parse(req.params);
            const dateStr = date.toISOString().slice(0, 10);
            const result = await activity_service_1.ActivityService.list(trip_id, dateStr);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            }
            next(err);
        }
    },
    remove: async (req, res, next) => {
        try {
            const { pit_id } = S.DeleteActivityParams.parse(req.params);
            await activity_service_1.ActivityService.remove(pit_id);
            res.status(204).send();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            }
            next(err);
        }
    },
};
// -------- Events --------
exports.EventController = {
    create: async (req, res, next) => {
        try {
            const { trip_id } = req.params;
            const body = S.CreateEventBody.parse(req.body);
            if (body.trip_id !== Number(trip_id)) {
                return res.status(400).json({ message: "trip_id mismatch" });
            }
            const result = await activity_service_1.EventService.create(+trip_id, body);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const { pit_id } = req.params;
            const body = S.UpdateEventBody.parse(req.body);
            const result = await activity_service_1.EventService.update(+pit_id, body);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
};
// -------- Places --------
exports.PlaceController = {
    add: async (req, res, next) => {
        try {
            const { trip_id } = req.params;
            const body = S.AddPlaceBody.parse(req.body);
            const result = await activity_service_1.PlaceService.add(+trip_id, body);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const { pit_id } = req.params;
            const body = S.UpdatePlaceBody.parse(req.body);
            const result = await activity_service_1.PlaceService.update(+pit_id, body);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
};
// -------- Voting --------
const getUserId = (req) => req.user?.id || req.headers["x-user-id"];
exports.VoteController = {
    list: async (req, res, next) => {
        try {
            const { trip_id, pit_id } = S.GetVotesParams.parse(req.params);
            const result = await activity_service_1.VoteService.list(trip_id, pit_id);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res
                    .status(400)
                    .json({ message: err.issues?.[0]?.message || "Invalid input" });
            }
            next(err);
        }
    },
    postInit: async (req, res, next) => {
        try {
            const { trip_id, type } = S.PostVoteTypeParams.parse(req.params);
            const body = type === "places"
                ? S.InitVotingBodyPlaces.parse(req.body)
                : S.InitVotingBodyEvents.parse(req.body);
            const result = await activity_service_1.VoteService.init(+trip_id, type, body);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
    voteByCandidate: async (req, res, next) => {
        try {
            const { trip_id, pit_id, place_id } = S.PostVoteByPlaceParams.parse(req.params);
            const body = req.body;
            const result = await activity_service_1.VoteService.voteByCandidate(trip_id, pit_id, place_id, body);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            }
            next(err);
        }
    },
    voteTypeEnd: async (req, res, next) => {
        try {
            const { trip_id, pit_id, type } = S.PostVoteByTypeEndParams.parse(req.params);
            // ไม่ต้อง parse body/ไม่ต้องส่ง body ให้ service แล้ว
            const result = await activity_service_1.VoteService.voteTypeEnd(trip_id, pit_id, type);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            }
            next(err);
        }
    },
    votedType: async (req, res, next) => {
        try {
            const { trip_id, pit_id, type } = S.PostVotedTypeParams.parse(req.params);
            const body = type === "places"
                ? S.PostVotedTypeBodyPlaces.parse(req.body)
                : S.PostVotedTypeBodyEvents.parse(req.body);
            const result = await activity_service_1.VoteService.votedType(trip_id, pit_id, type, body.user_id, body);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
    patchVote: async (req, res, next) => {
        try {
            const { trip_id, pit_id } = S.PatchVoteParams.parse(req.params);
            const patch = S.PatchVoteBody.parse(req.body);
            const result = await activity_service_1.VoteService.patchVote(trip_id, pit_id, patch);
            res.status(200).json(result);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
    unvote: async (req, res, next) => {
        try {
            const { trip_id, pit_id } = S.DeleteVoteParams.parse(req.params);
            await activity_service_1.VoteService.unvote(trip_id, pit_id);
            res.status(204).send();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    },
    deleteVote: async (req, res, next) => {
        try {
            const { trip_id, pit_id } = S.DeleteVoteParamss.parse(req.params);
            const { user_id } = req.body; // รับ user_id จาก client
            const result = await activity_service_1.VoteService.deleteVote(trip_id, pit_id, user_id);
            res.status(200).json({ success: result });
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
            next(err);
        }
    }
};
//# sourceMappingURL=activity.controller.js.map