import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./trips.schema";
import {z} from "zod";

export function registerTrips(registry: OpenAPIRegistry) {

  registry.registerPath({
    method: "get",
    path: "/api/trips/by-user",
    operationId: "Get all Trips management from user",
    summary: "Returns trip(s) from 1 user",
    responses: {
      200: {
        description: "List of Trip(s) detail",
        content: { "application/json": { schema: schema.TripSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Trips management"],
    
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
    tags: ["Trips management"],
    
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
    tags: ["Trips management"],
    
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips",
    summary: "Create a new trip",
    tags: ["Trips management"],
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: schema.TripCreateSchema.extend({
              trip_image: z.string().openapi({
                type: "string",
                format: "binary",
              }),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: "Trip created successfully",
        content: { "application/json": { schema: schema.TripSchema } },
      },
      400: {
        description: "Validation error",
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/trips/{trip_id}",
    operationId: "Update trip detail",
    summary: "Returns updated trip detail",
    request: {
      params: schema.tSchema,
      body: {
        description: "Can specific update",
        content: {
          "multipart/form-data": {
            schema: schema.TripUpdateSchema.extend({
              trip_image: z.string().openapi({
                type: "string",
                format: "binary",
              }).optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "List of trip details",
        content: { "multipart/form-data": { schema: schema.TripSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Trips management"],
    
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}",
    operationId: "Delete trip",
    summary: "Delete trip",
    request: {
      params: schema.tSchema,
    },
    responses: {
      204: {
        description: "Delete completed",
      },
      400: { description: "Validation error" },
    },
    tags: ["Trips management"],
    
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/leave",
    operationId: "Leave trip",
    summary: "Leave trip",
    request: {
      params: schema.tSchema,
    },
    responses: {
      204: {
        description: "Completed leave trip",
      },
      400: { description: "Validation error" },
    },
    tags: ["Trips management"],
    
  });
}