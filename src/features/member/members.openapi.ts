import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from './member.schema'
import {z} from "zod";

export function registerMembers(registry: OpenAPIRegistry) {

  registry.registerPath({
    method: "get",
    path: "/api/trips/members/{trip_id}",
    operationId: "Get all trip members",
    summary: "Returns trip member(s) details",
    request: {
        params: schema.tSchema
    },
    responses: {
      200: {
        description: "List of trip member(s)",
        content: { "application/json": { schema: z.array(schema.MemberSchema) } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Members management"],
    
  });

  registry.registerPath({
    method: "patch",
    path: "/api/trips/members/{trip_id}",
    operationId: "Edit member role",
    summary: "Returns edited member details",
    request: {
        params: schema.tSchema,
        body: {
          content: {
            "application/json" : {
              schema: schema.roleSchema
            }
          }
        },
    },
    responses: {
      200: {
        description: "Object of member details",
        content: { "application/json": { schema: schema.MemberSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Members management"],
    
  });
  
  registry.registerPath({
    method: "delete",
    path: "/api/trips/members/{trip_id}/{collab_id}",
    operationId: "Delete member from trip",
    summary: "Returns deleted member details",
    request: {
        params: schema.tcSchema
    },
    responses: {
      204: {
        description: "Object of member details",
        content: { "application/json": { schema: schema.MemberSchema } },
      },
      400: { description: "Validation error" },
    },
    tags: ["Members management"],
    
  });
};