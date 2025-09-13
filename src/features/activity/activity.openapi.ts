import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./activity.schema";

export function registerActivity(registry: OpenAPIRegistry) {
  // ---------------- Activities ----------------
  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/activities/{date}",
    operationId: "getActivitiesByDate",
    summary: "Get activities by date for a trip",
    request: {
      params: schema.GetActivitiesByDateParams,
    },
    responses: {
      200: {
        description: "List of activities",
        content: { "application/json": { schema: schema.ActivitiesResponse } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Activities"],
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/activities/{pit_id}",
    operationId: "deleteActivity",
    summary: "Delete an activity by pit_id",
    request: {
      params: schema.DeleteActivityParams,
    },
    responses: {
      204: { description: "Deleted successfully" },
      400: { description: "Validation error" },
    },
    tags: ["Activities"],
  });

  // ---------------- Events ----------------
  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/events",
    operationId: "createEvent",
    summary: "Add new event to trip",
    request: {
      body: {
        content: {
          "application/json": { schema: schema.CreateEventBody },
        },
      },
    },
    responses: {
      200: { description: "Event created" },
      400: { description: "Validation error" },
    },
    tags: ["Events"],
  });

  registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/activities/{pit_id}/events",
    operationId: "updateEvent",
    summary: "Update event in trip",
    request: {
      params: schema.ParamsTripPit,
      body: {
        content: {
          "application/json": { schema: schema.UpdateEventBody },
        },
      },
    },
    responses: {
      200: { description: "Event updated" },
      400: { description: "Validation error" },
    },
    tags: ["Events"],
  });

  // ---------------- Places ----------------
  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/places",
    operationId: "addPlace",
    summary: "Add new place to trip",
    request: {
      body: {
        content: {
          "application/json": { schema: schema.AddPlaceBody },
        },
      },
    },
    responses: {
      200: { description: "Place added" },
      400: { description: "Validation error" },
    },
    tags: ["Places"],
  });

  registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/activities/{pit_id}/places",
    operationId: "updatePlace",
    summary: "Update place in trip",
    request: {
      params: schema.ParamsTripPit,
      body: {
        content: {
          "application/json": { schema: schema.UpdatePlaceBody },
        },
      },
    },
    responses: {
      200: { description: "Place updated" },
      400: { description: "Validation error" },
    },
    tags: ["Places"],
  });

  // ---------------- Voting ----------------
  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
    operationId: "getVotes",
    summary: "Get voting results for activities",
    request: {
      params: schema.GetVotesParams,
    },
    responses: {
      200: {
        description: "Voting data",
        content: {
          "application/json": {
            schema: schema.PlacesVotingResponse.or(schema.EventVotingResponse),
          },
        },
      },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/votes/{type}",
    operationId: "initVotingBlock",
    summary: "Init voting block for place/event",
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
    responses: {
      200: { description: "Voting block initialized" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes/{place_id}",
    operationId: "voteByPlace",
    summary: "Add vote for a place",
    request: {
      params: schema.PostVoteByPlaceParams,
    },
    responses: {
      200: { description: "Vote registered" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes/{type}/end",
    operationId: "endVoting",
    summary: "End voting for places/events",
    request: {
      params: schema.PostVoteByTypeEndParams,
      body: {
        content: {
          "application/json": {
            schema: schema.PostVoteByTypeEndBodyPlaces.or(schema.PostVoteByTypeEndBodyEvents),
          },
        },
      },
    },
    responses: {
      200: { description: "Voting ended" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/{pit_id}/voted/{type}",
    operationId: "votedType",
    summary: "Add user vote (event/place)",
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
    responses: {
      200: { description: "Vote registered" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
    operationId: "patchVote",
    summary: "Update voting block",
    request: {
      params: schema.PatchVoteParams,
      body: {
        content: { "application/json": { schema: schema.PatchVoteBody } },
      },
    },
    responses: {
      200: { description: "Voting updated" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
    operationId: "deleteVoteBlock",
    summary: "Delete voting block",
    request: {
      params: schema.DeleteVoteParams,
    },
    responses: {
      204: { description: "Voting block deleted" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });
}
