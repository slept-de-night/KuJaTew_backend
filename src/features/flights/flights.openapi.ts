import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./flights.schema";

export function registerFlights(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/flights",
    operationId: "GetTripFlights",
    summary: "Get all flights inside a trip",
    tags: ["Flights"],
    request: {
      params: schema.TripIdParamSchema,
    },
    responses: {
      200: {
        description: "List of all flights inside a trip",
        content: {
          "application/json": {
            schema: schema.FlightListResponseSchema,
          },
        },
      },
      400: { description: "Validation error" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/flights",
    operationId: "PostTripFlights",
    summary: "Add flight to a trip",
    tags: ["Flights"],
    request: {
      params: schema.TripIdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: schema.PostFlightSchema,
          },
        },
      },
    },
    responses: {
      200: { description: "flight already exist in trip" },
      201: { description: "flight added" },
      400: { description: "Validation error" },
      500: { description: "Invalid Permission" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/flights/{flight_id}",
    operationId: "DeleteTripFlights",
    summary: "remove flight from a trip",
    tags: ["Flights"],
    request: {
      params: schema.TripFlightParamSchema,
    },
    responses: {
      200: { description: "Flight removed" },
      404: { description: "flight not found" },
      400: { description: "Validation error" },
      500: { description: "Invalid Permission" },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/trips/{trip_id}/flights/{flight_id}",
    operationId: "PutTripFlights",
    summary: "Update flight inside a trip",
    tags: ["Flights"],
    request: {
      params: schema.TripFlightParamSchema,
      body: {
        content: {
          "application/json": {
            schema: schema.putflightitemschema,
          },
        },
      },
    },
    responses: {
      201: { description: "Flight updated" },
      404: { description: "flight not found" },
      400: { description: "Validation error" },
      500: { description: "Invalid Permission" },
    },
  });
}
