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
exports.registerActivity = registerActivity;
const schema = __importStar(require("./activity.schema"));
function registerActivity(registry) {
    // Register all schemas
    registry.register("ActivityItem", schema.ActivityItem);
    registry.register("ActivitiesResponse", schema.ActivitiesResponse);
    registry.register("PlacesVotingResponse", schema.PlacesVotingResponse);
    registry.register("EventVotingResponse", schema.EventVotingResponse);
    // ---------- Activities ----------
    registry.registerPath({
        method: "get",
        path: "/api/trips/{trip_id}/activities/AllDate",
        operationId: "listAllActivities",
        summary: "List all activities across all dates in a trip",
        request: { params: schema.ParamsTrip },
        responses: {
            200: { description: "All activities", content: { "application/json": { schema: schema.ActivitiesResponse } } },
            400: { description: "Validation error" },
        },
        tags: ["Activities"],
    });
    registry.registerPath({
        method: "get",
        path: "/api/trips/{trip_id}/activities/{date}",
        operationId: "listActivitiesByDate",
        summary: "List activities by date",
        request: { params: schema.GetActivitiesByDateParams },
        responses: {
            200: { description: "Activities of given date", content: { "application/json": { schema: schema.ActivitiesResponse } } },
            400: { description: "Validation error" },
        },
        tags: ["Activities"],
    });
    registry.registerPath({
        method: "delete",
        path: "/api/trips/{trip_id}/activities/{pit_id}",
        operationId: "deleteActivity",
        summary: "Delete activity by pit_id",
        request: { params: schema.DeleteActivityParams },
        responses: { 204: { description: "Deleted successfully" }, 400: { description: "Validation error" } },
        tags: ["Activities"],
    });
    // ---------- Events ----------
    registry.registerPath({
        method: "post",
        path: "/api/trips/{trip_id}/activities/events",
        operationId: "createEvent",
        summary: "Create a new event",
        request: { body: { content: { "application/json": { schema: schema.CreateEventBody } } } },
        responses: { 200: { description: "Created event" }, 400: { description: "Validation error" } },
        tags: ["Events"],
    });
    registry.registerPath({
        method: "patch",
        path: "/api/trips/{trip_id}/activities/{pit_id}/events",
        operationId: "updateEvent",
        summary: "Update event by pit_id",
        request: { body: { content: { "application/json": { schema: schema.UpdateEventBody } } } },
        responses: { 200: { description: "Updated event" }, 400: { description: "Validation error" } },
        tags: ["Events"],
    });
    // ---------- Places ----------
    registry.registerPath({
        method: "post",
        path: "/api/trips/{trip_id}/activities/places",
        operationId: "addPlace",
        summary: "Add place to trip",
        request: { body: { content: { "application/json": { schema: schema.AddPlaceBody } } } },
        responses: { 200: { description: "Added place" }, 400: { description: "Validation error" } },
        tags: ["Places"],
    });
    registry.registerPath({
        method: "patch",
        path: "/api/trips/{trip_id}/activities/{pit_id}/places",
        operationId: "updatePlace",
        summary: "Update place by pit_id",
        request: { body: { content: { "application/json": { schema: schema.UpdatePlaceBody } } } },
        responses: { 200: { description: "Updated place" }, 400: { description: "Validation error" } },
        tags: ["Places"],
    });
    // ---------- Voting ----------
    registry.registerPath({
        method: "get",
        path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
        operationId: "getVotes",
        summary: "Get voting results",
        request: { params: schema.GetVotesParams },
        responses: {
            200: {
                description: "Voting results",
                content: { "application/json": { schema: schema.PlacesVotingResponse } },
            },
            400: { description: "Validation error" },
        },
        tags: ["Voting"],
    });
    registry.registerPath({
        method: "post",
        path: "/api/trips/{trip_id}/activities/votes/{type}",
        operationId: "initVoting",
        summary: "Initialize voting block for places or events",
        request: {
            params: schema.PostVoteTypeParams,
            body: {
                content: {
                    "application/json": {
                        schema: schema.InitVotingBodyPlaces.or(schema.InitVotingBodyEvents),
                    },
                },
            },
        },
        responses: { 200: { description: "Voting block initialized" }, 400: { description: "Validation error" } },
        tags: ["Voting"],
    });
    registry.registerPath({
        method: "post",
        path: "/api/trips/{trip_id}/activities/{pit_id}/votes/{place_id}",
        operationId: "voteByCandidate",
        summary: "Vote by candidate place",
        request: { params: schema.PostVoteByPlaceParams },
        responses: { 200: { description: "Vote cast" }, 400: { description: "Validation error" } },
        tags: ["Voting"],
    });
    registry.registerPath({
        method: "post",
        path: "/api/trips/{trip_id}/activities/{pit_id}/votes/{type}/end",
        operationId: "endVoting",
        summary: "End voting and select winner",
        request: { params: schema.PostVoteByTypeEndParams },
        responses: { 200: { description: "Winner selected" }, 400: { description: "Validation error" } },
        tags: ["Voting"],
    });
    registry.registerPath({
        method: "post",
        path: "/api/trips/{trip_id}/activities/{pit_id}/voted/{type}",
        operationId: "castVote",
        summary: "Cast user vote for place or event",
        request: {
            params: schema.PostVotedTypeParams,
            body: {
                content: {
                    "application/json": {
                        schema: schema.PostVotedTypeBodyPlaces.or(schema.PostVotedTypeBodyEvents),
                    },
                },
            },
        },
        responses: { 200: { description: "Vote recorded" }, 400: { description: "Validation error" } },
        tags: ["Voting"],
    });
    registry.registerPath({
        method: "patch",
        path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
        operationId: "patchVote",
        summary: "Update vote timing",
        request: { body: { content: { "application/json": { schema: schema.PatchVoteBody } } } },
        responses: { 200: { description: "Vote updated" }, 400: { description: "Validation error" } },
        tags: ["Voting"],
    });
    registry.registerPath({
        method: "delete",
        path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
        operationId: "unvote",
        summary: "Remove voting block",
        request: { params: schema.DeleteVoteParams },
        responses: { 204: { description: "Voting block removed" }, 400: { description: "Validation error" } },
        tags: ["Voting"],
    });
    registry.registerPath({
        method: "delete",
        path: "/api/trips/{trip_id}/activities/{pit_id}/voted",
        operationId: "deleteVote",
        summary: "Delete user's vote",
        request: {
            params: schema.DeleteVoteParamss,
            body: { content: { "application/json": { schema: schema.DeleteVoteBody } } },
        },
        responses: { 200: { description: "Vote deleted" }, 400: { description: "Validation error" } },
        tags: ["Voting"],
    });
}
//# sourceMappingURL=activity.openapi.js.map