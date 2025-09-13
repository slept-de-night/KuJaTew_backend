import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./places-info.schema";

export function registerPlaceInfo(registry: OpenAPIRegistry) {
  registry.register("AutocompletePathParams", schema.AutocompletePathParams);
  registry.register("Predictions", schema.AutoCompleteSchema);
  registry.register("InputPlaceDetailsType",schema.InputPlaceDetailsSchema)
  registry.register("PlaceDetails",schema.PlaceSchema)

  registry.registerPath({
    method: "get",
    path: "/api/places/{id}/{type}",
    operationId: "getPlaceDetails by api_id or place_id",
    summary: "Returns place information for the given id",
    request: {
      params: schema.InputPlaceDetailsSchema,
    },
    responses: {
      200: {
        description: "Places Information",
        content: { "application/json": { schema: schema.PlaceSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["place Infomation"],
    
  });

  registry.registerPath({
    method: "get",
    path: "/api/places/autocomplete/{input}",
    operationId: "getAutocompleteByInput",
    summary: "Returns place predictions for the given input",
    request: {
      params: schema.AutocompletePathParams,
    },
    responses: {
      200: {
        description: "List of predictions",
        content: { "application/json": { schema: schema.AutoCompleteSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["place Infomation"],
    
  });
}
