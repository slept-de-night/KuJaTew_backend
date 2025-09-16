"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventVotingResponse = exports.PlacesVotingResponse = exports.PlaceVotingItem = exports.ActivitiesResponse = exports.ActivityItem = exports.DeleteVoteBody = exports.DeleteVoteParamss = exports.DeleteVoteParams = exports.PatchVoteBody = exports.PatchVoteParams = exports.PostVotedTypeBodyEvents = exports.PostVotedTypeBodyPlaces = exports.PostVotedTypeParams = exports.PostVoteByTypeEndParams = exports.InitVotingBodyEvents = exports.InitVotingBodyPlaces = exports.PostVoteByPlaceParams = exports.PostVoteTypeParams = exports.GetVotesParams = exports.UpdatePlaceBody = exports.AddPlaceBody = exports.UpdateEventBody = exports.CreateEventBody = exports.DeleteActivityParams = exports.GetActivitiesByDateParams = exports.ParamsTripPit = exports.ParamsTrip = void 0;
const zod_1 = require("zod");
const isoDate = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");
const isoTime = zod_1.z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "time must be HH:mm");
exports.ParamsTrip = zod_1.z.object({
    trip_id: zod_1.z.preprocess((v) => Number(v), zod_1.z.number().int().positive())
});
exports.ParamsTripPit = exports.ParamsTrip.extend({
    pit_id: zod_1.z.preprocess((v) => Number(v), zod_1.z.number().int().positive())
});
// ---------- Activities ----------
exports.GetActivitiesByDateParams = exports.ParamsTrip.extend({
    date: zod_1.z.coerce.date(),
});
exports.DeleteActivityParams = exports.ParamsTripPit;
// ---------- Events ----------
exports.CreateEventBody = zod_1.z.object({
    trip_id: zod_1.z.number().int().positive(),
    place_id: zod_1.z.literal(0),
    date: isoDate,
    time_start: isoTime,
    time_end: isoTime,
    event_name: zod_1.z.string().min(1),
    is_vote: zod_1.z.literal(false),
    is_event: zod_1.z.literal(true),
});
exports.UpdateEventBody = zod_1.z.object({
    date: isoDate,
    time_start: isoTime,
    time_end: isoTime,
    event_name: zod_1.z.string().min(1),
});
// ---------- Places ----------
exports.AddPlaceBody = zod_1.z.object({
    place_id: zod_1.z.number().int().positive(),
    date: isoDate,
    time_start: isoTime,
    time_end: isoTime,
    is_vote: zod_1.z.literal(false),
    event_name: zod_1.z.literal(""),
    is_event: zod_1.z.literal(false),
});
exports.UpdatePlaceBody = zod_1.z.object({
    date: isoDate,
    time_start: isoTime,
    time_end: isoTime,
});
// ---------- Voting ----------
exports.GetVotesParams = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
    pit_id: zod_1.z.coerce.number().int().positive(),
});
exports.PostVoteTypeParams = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
    type: zod_1.z.enum(["places", "events"]),
});
exports.PostVoteByPlaceParams = exports.ParamsTripPit.extend({
    place_id: zod_1.z.preprocess((v) => Number(v), zod_1.z.number().int().nonnegative())
});
exports.InitVotingBodyPlaces = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
    place_id: zod_1.z.literal(0),
    date: zod_1.z.string(),
    time_start: zod_1.z.string(),
    time_end: zod_1.z.string(),
    is_vote: zod_1.z.literal(true),
    is_event: zod_1.z.literal(false),
});
exports.InitVotingBodyEvents = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
    place_id: zod_1.z.coerce.number().int().positive(),
    date: zod_1.z.string(),
    time_start: zod_1.z.string(),
    time_end: zod_1.z.string(),
    is_vote: zod_1.z.literal(true),
    is_event: zod_1.z.literal(true),
});
exports.PostVoteByTypeEndParams = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
    pit_id: zod_1.z.coerce.number().int().positive(),
    type: zod_1.z.enum(["places", "events"]),
});
exports.PostVotedTypeParams = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
    pit_id: zod_1.z.coerce.number().int().positive(),
    type: zod_1.z.enum(["places", "events"])
});
exports.PostVotedTypeBodyPlaces = zod_1.z.object({ user_id: zod_1.z.string() });
exports.PostVotedTypeBodyEvents = zod_1.z.object({
    user_id: zod_1.z.string(),
    event_name: zod_1.z.string().min(1),
});
exports.PatchVoteParams = zod_1.z.object({
    trip_id: zod_1.z.coerce.number().int().positive(),
    pit_id: zod_1.z.coerce.number().int().positive(),
});
exports.PatchVoteBody = zod_1.z.object({
    date: zod_1.z.string(),
    start_time: zod_1.z.string(),
    end_time: zod_1.z.string(),
});
exports.DeleteVoteParams = exports.PatchVoteParams;
exports.DeleteVoteParamss = zod_1.z.object({
    trip_id: zod_1.z.coerce.number(),
    pit_id: zod_1.z.coerce.number(),
});
exports.DeleteVoteBody = zod_1.z.object({
    user_id: zod_1.z.string().min(1),
});
// ---------- Response Schemas ----------
exports.ActivityItem = zod_1.z.object({
    pit_id: zod_1.z.number(),
    place_id: zod_1.z.number().nullable(),
    trip_id: zod_1.z.number(),
    date: zod_1.z.date(),
    time_start: zod_1.z.string().nullable(),
    time_end: zod_1.z.string().nullable(),
    address: zod_1.z.string().nullable(),
    is_vote: zod_1.z.boolean(),
    event_name: zod_1.z.string().nullable(),
    is_event: zod_1.z.boolean(),
    photo_url: zod_1.z.string().nullable(),
});
exports.ActivitiesResponse = zod_1.z.object({ activities: zod_1.z.array(exports.ActivityItem) });
exports.PlaceVotingItem = zod_1.z.object({
    pit_id: zod_1.z.number(),
    place_id: zod_1.z.number(),
    address: zod_1.z.string(),
    place_picture_url: zod_1.z.string(),
    voting_count: zod_1.z.number(),
    is_voted: zod_1.z.boolean(),
    is_most_voted: zod_1.z.boolean(),
});
exports.PlacesVotingResponse = zod_1.z.object({
    date: zod_1.z.date(),
    time_start: zod_1.z.string(),
    time_end: zod_1.z.string(),
    places_voting: zod_1.z.array(exports.PlaceVotingItem),
});
exports.EventVotingResponse = zod_1.z.object({
    date: zod_1.z.date(),
    time_start: zod_1.z.string(),
    time_end: zod_1.z.string(),
    event_voting: zod_1.z.object({
        pit_id: zod_1.z.number(),
        event_name: zod_1.z.string(),
        voting_count: zod_1.z.number(),
        is_voted: zod_1.z.boolean(),
        is_most_voted: zod_1.z.string(),
    }),
});
//# sourceMappingURL=activity.schema.js.map