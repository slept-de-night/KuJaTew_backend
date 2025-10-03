import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./search.schema";
import {z} from "zod";

export function registerSearch(registry: OpenAPIRegistry) {

  registry.registerPath({
    method: "get",
    path: "/api/search/users/{username}/{trip_id}",
    operationId: "search users by username",
    summary: "Returns user infomation",
    request: {
      params: z.object({
        username:z.string(),
        trip_id:z.number(),
      }),
    },
    responses: {
      200: {
        description: "User(s) infomation",
        content: { "application/json": { schema: z.array(schema.userschema) } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Search"],
    
  });

  registry.registerPath({
    method: "get",
    path: "/api/search/guides/{guide_name}/",
    operationId: "search guides by guide_name",
    summary: "Returns guide infomation",
    request: {
      params: z.object({
        guide_name:z.string(),
      }),
    },
    responses: {
      200: {
        description: "Guide(s) infomation",
        content: { "application/json": { schema: z.array(schema.guideschema) } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Search"],
    
  });
}
