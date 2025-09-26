import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./notifications.schema";

export function registerNotifications(registry: OpenAPIRegistry) {
  // GET /api/trips/notifications/{trip_id}/{limit}
  registry.registerPath({
    method: "get",
    path: "/api/trips/notifications/{trip_id}/{limit}",
    operationId: "GetTripNotifications",
    summary: "Get notifications inside a trip",
    tags: ["Notifications"],
    request: {
      params: schema.get_notifications_schema,
    },
    responses: {
      200: {
        description: "List of notifications",
        content: {
          "application/json": {
            schema: schema.get_noti_schema, 
          },
        },
      },
      400: { description: "Validation error" },
      500: { description: "Server error" },
    },
  });

  registry.registerPath({
      method: "post",
      path: "/api/trips/{trip_id}/notifications",
      operationId: "PostTripNotifications",
      summary: "Add notification to a trip",
      tags: ["Notifications"],
      request: {
        params: schema.TripIdParamSchema,
        body: {
          content: {
            "application/json": {
              schema: schema.example_swagger,
            },
          },
        },
      },
      responses: {
        200: { description: "Notification already exist" },
        201: { description: "Notification added" },
        400: { description: "Validation error" },
        500: { description: "Invalid Permission" },
      },
    });
}


