import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./trips.schema";

export function registerTrips(registry: OpenAPIRegistry) {

  registry.registerPath({
    method: "get",
    path: "/api/trips/by-user",
    operationId: "Get all trips detail from user",
    summary: "Returns trip(s) from 1 user",
    responses: {
      200: {
        description: "List of Trip(s) detail",
        content: { "application/json": { schema: schema.TripSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Trips detail"],
    
  });

  registry.registerPath({
    method: "get",
    path: "/api/trips/by-trip/{trip_id}",
    operationId: "Get trip details by trip_id",
    summary: "Returns trip details",
    request: {
      params: schema.tSchema,
    },
    responses: {
      200: {
        description: "List of trip details",
        content: { "application/json": { schema: schema.TripSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Trips detail"],
    
  });

  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/summarize",
    operationId: "Get trip summary by trip_id",
    summary: "Returns trip summary",
    request: {
      params: schema.tSchema,
    },
    responses: {
      200: {
        description: "List of trip summary details",
        content: { "application/json": { schema: schema.TripSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Trips detail"],
    
  });
}