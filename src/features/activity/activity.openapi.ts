// activity.openapi.ts
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./activity.schema";
import {z} from "zod";

//place_id > 0 , is_vote = False , is_event = False : place ใน trip 
//place_id = 0 , is_vote = False , is_event = True : event ใน trip 
//place_id = 0 , is_vote = True , is_event = False : Block Vote ของ place
//place_id > 0 , is_vote = True , is_event = True : Block Vote ของ event
//place_id > 0 , is_vote = True , is_event = False : candidate ของ place
//place_id = 0 , is_vote = True , is_event = True  : candidate ของ event 


export function registerActivity(registry: OpenAPIRegistry) {
// Register all schemas
  registry.register("ActivityItem", schema.ActivityItem);
  registry.register("ActivitiesResponse", schema.ActivitiesResponse);
  registry.register("PlacesVotingResponse", schema.PlacesVotingResponse);
  registry.register("EventVotingResponse", schema.EventVotingResponse);
  registry.register("GetUserVotedResponse", schema.GetUserVotedResponse);
  registry.register("PlaceItem", schema.PlaceItem);
  registry.register("PlaceResponse", schema.PlaceResponse);

  // ---------- Activities ----------
  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/activities/AllDate",
    operationId: "listAllActivities",
    summary: "List all activities across all dates in a trip",
    request: { params: schema.ParamsTrip },
    responses: {
      200: {
        description: "All activities",
        content: { "application/json": { schema: schema.ActivitiesResponse } },
      },
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
      200: {
        description: "Activities of given date",
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
    summary: "Delete activity by pit_id",
    request: { params: schema.DeleteActivityParams },
    responses: {
      204: { description: "Deleted successfully" },
      400: { description: "Validation error" },
    },
    tags: ["Activities"],
  });

  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/activities/onlyPlaces/{date}",
    operationId: "getPlacesByTripDate",
    summary: "Get only places of a trip by date",
    description:
      "Return only places (exclude events/votes) of a trip for a given date, sorted by time_start.",
    tags: ["activity"],
    request: {
      params: schema.GetActivitiesByDateParams,
    },
    responses: {
      200: {
        description: "List of places for the trip and date",
        content: {
          "application/json": {
            schema: schema.PlaceResponse,
          },
        },
      },
      400: { description: "Invalid parameters" },
      500: { description: "Internal Server Error" },
    },
    security: [{ bearerAuth: [] }],
  });

  // ---------- Events ----------
  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/events",
    operationId: "createEvent",
    summary: "Create a new event",
    request: {
      params: schema.ParamsTrip,
      body: {
        content: { "application/json": { schema: schema.CreateEventBody } },
      },
    },
    responses: {
      200: { description: "Created event" },
      400: { description: "Validation error" },
    },
    tags: ["Events"],
  });

  registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/activities/{pit_id}/events",
    operationId: "updateEvent",
    summary: "Update event by pit_id",
    request: {
      params: schema.DeleteActivityParams,
      body: {
        content: { "application/json": { schema: schema.UpdateEventBody } },
      },
    },
    responses: {
      200: { description: "Updated event" },
      400: { description: "Validation error" },
    },
    tags: ["Events"],
  });

  // ---------- Places ----------
  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/places",
    operationId: "addPlace",
    summary: "Add place to trip",
    request: {
      params: schema.ParamsTrip, 
      body: {
        content: { "application/json": { schema: schema.AddPlaceBody } },
      },
    },
    responses: {
      200: { description: "Added place" },
      400: { description: "Validation error" },
    },
    tags: ["Places"],
  });

  registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/activities/{pit_id}/places",
    operationId: "updatePlace",
    summary: "Update place by pit_id",
    request: {
      params: schema.DeleteActivityParams ,
      body: {
        content: { "application/json": { schema: schema.UpdatePlaceBody } },
      },
    },
    responses: {
      200: { description: "Updated place" },
      400: { description: "Validation error" },
    },
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
        content: {
          "application/json": { schema: schema.PlacesVotingResponse },
        },
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
            schema: schema.InitVotingBodyPlaces.or(
              schema.InitVotingBodyEvents
            ),
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
    operationId: "voteByCandidate",
    summary: "Vote by candidate place",
    request: { params: schema.PostVoteByPlaceParams },
    responses: {
      200: { description: "Vote cast" },
      400: { description: "Validation error" },
    },
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
            schema: schema.PostVotedTypeBodyPlaces.or(
              schema.PostVotedTypeBodyEvents
            ),
          },
        },
      },
    },
    responses: {
      200: { description: "Vote recorded" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
    operationId: "patchVote",
    summary: "Update vote timing",
    request: {
      params: schema.PatchVoteParams,
      body: {
        content: { "application/json": { schema: schema.PatchVoteBody } },
      },
    },
    responses: {
      200: { description: "Vote updated" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes",
    operationId: "cleanVote",
    summary: "Clean voting block",
    request: { params: schema.DeleteVoteParams },
    responses: {
      204: { description: "Voting block removed" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/activities/{pit_id}/voted",
    operationId: "deleteVote",
    summary: "Delete user's vote",
    request: { params: schema.DeleteVoteParamss },
    responses: {
      200: { description: "Vote deleted" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes/{type}/end",
    operationId: "getWinners",
    summary: "Get winners for a voting block (places or events)",
    request: { params: schema.PostVoteByTypeEndParams },
    responses: {
      200: { description: "Winners list" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/activities/{pit_id}/voted",
    operationId: "getUserVoted",
    summary: "Check if current user has voted",
    request: { params: schema.GetUserVotedParams },
    responses: {
      200: {
        description: "User voting status",
        content: { "application/json": { schema: schema.GetUserVotedResponse } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/activities/{pit_id}/votes/{type}/endOwner",
    operationId: "endOwner",
    summary: "Close voting block and set winner (owner only)",
    request: { params: schema.PostVoteEndOwnerParams },
    responses: {
      200: { description: "Voting block closed with winner" },
      400: { description: "Validation error" },
    },
    tags: ["Voting"],
  });
}
