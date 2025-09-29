import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./docs.schema";
import {z} from "zod";

export function registerDocs(registry: OpenAPIRegistry) {

  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/documents",
    operationId: "Get all document in trip",
    summary: "Returns all docs",
    request: {
      params: z.object({trip_id:z.coerce.number()}),
    },
    responses: {
      200: {
        description: "List of docs detail",
        content: { "application/json": { schema: z.array(schema.getalldoc) } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Documents"],
    
  });

  registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/documents/{doc_id}",
    operationId: "Get specific doc for download",
    summary: "Returns doc url",
    request: {
      params: schema.GetDocumentSchema,
    },
    responses: {
      200: {
        description: "Document URL",
        content: { "application/json": { schema: z.object({signedUrl:z.string()}) } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Documents"],
    
  });

  registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/documents",
    operationId: "Add file to trip",
    summary: "add file to trip",
    request: {
      params: z.object({trip_id:z.coerce.number()}),
    },
    responses: {
      201: {
        description: "document details",
        content: { "multipart/form-data": { schema: z.object({ 
            file: z.string().openapi({type: "string", format: "binary",
              })})}},
      },
      400: { description: "Validation error" },
    },
    tags: ["Documents"],
    
  });

  registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/documents/{doc_id}",
    operationId: "Delete documents",
    summary: "Delete specific doc",
    responses: {
      204: {
        description: "return 1 if complete",
      },
      400: { description: "Validation error" },
    },
    tags: ["Documents"],
  });
}