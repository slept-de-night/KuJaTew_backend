// activity.openapi.ts
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./activity.schema";

export function registerActivity(registry: OpenAPIRegistry) {
  
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
