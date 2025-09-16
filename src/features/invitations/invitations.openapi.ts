import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./invitations.schema";

export function registerInvitations(registry: OpenAPIRegistry) {
  // Invite user
  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/invite",
    operationId: "InviteUserToTrip",
    summary: "Invite another user to a trip",
    tags: ["Invitations"],
    request: {
      params: schema.TripIdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: schema.UserNameBodySchema,
          },
        },
      },
    },
    responses: {
      201: { description: "Invite successfully" },
      200: { description: "User already invited" },
      400: { description: "Validation error" },
      500: { description: "Permission denied" },
    },
  });

  // Join with code
  registry.registerPath({
    method: "post",
    path: "/api/trips/invite/self",
    operationId: "JoinTripByCode",
    summary: "Join a trip using invite code and password",
    tags: ["Invitations"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: schema.TripCodePasswordBodySchema,
          },
        },
      },
    },
    responses: {
      201: { description: "Join successfully" },
      200: { description: "User already joined" },
      400: { description: "Validation error" },
      500: { description: "Wrong trip code or password" },
    },
  });

  // Accept invite
  registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/invite/accept",
    operationId: "AcceptTripInvite",
    summary: "Accept an invite for a trip",
    tags: ["Invitations"],
    request: {
      params: schema.TripIdParamSchema,
    },
    responses: {
      201: { description: "Accept invite successfully" },
      200: { description: "User already accepted invite" },
      400: { description: "Validation error" },
      500: { description: "Invalid permission" },
    },
  });

  // Reject invite
  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/invite/reject",
    operationId: "RejectTripInvite",
    summary: "Reject an invite for a trip",
    tags: ["Invitations"],
    request: {
      params: schema.TripIdParamSchema,
    },
    responses: {
      201: { description: "Reject invite successfully" },
      200: { description: "User already rejected invite" },
      400: { description: "Validation error" },
      500: { description: "Invalid permission" },
    },
  });
}
