import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./copy.schema";

export function registerCopy(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/copyTrip",
    operationId: "PostCopyUserTrip",
    summary: "Copy trip",
    tags: ["Copy"],
    request: {
      params: schema.trip_id_schema_swag,
      body: {
        content: {
          "application/json": {
            schema: schema.trip_code_schema_swag,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Trip Copied",
        content: {
          "application/json": {
            schema: schema.trip_copied_schema,
          },
        },
      },
      500: { description: "Copy Failed" },
      400: { description: "Invalid Input" },
    },
  });
}
