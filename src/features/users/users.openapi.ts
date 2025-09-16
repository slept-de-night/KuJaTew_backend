import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./users.schema";
import { IdTokenSchema } from "./users.schema";

export function registerUsers(registry: OpenAPIRegistry) {
  registry.register("AutocompletePathParams", schema.UsersFullOutSchema);
  

  registry.registerPath({
    method: "get",
    path: "/api/users/{user_id}",
    operationId: "get user details for specific user_id ",
    summary: "Returns user information for the given user_id",
    request: {
      params: schema.UserIdSchema,
    },
    responses: {
      200: {
        description: "User Information",
        content: { "application/json": { schema: schema.UsersFullOutSchema } },
      },
      400: { description: "Validation error" },
     
    },
    tags: ["Users"],
  });

  registry.registerPath({
    method: "post",
    path: "/api/users/login",
    operationId: "get user details for specific user_id ",
    summary: "Returns user information if user not exist include jwt token",
    
    request: {
        body:{
            description: "Google Idtoken",
            content:{
                "application/json":{
                    schema:IdTokenSchema
                }
            }
        }
    },
    responses: {
      200: {
        description: "user infomation for exist user",
        content: { "application/json": { schema: schema.LoginSchema } },
      },
      201: {
        description: "user infomation created from google data",
        content: { "application/json": { schema: schema.LoginSchema } },
      },
      400: { description: "Validation error" },
     
    },
    tags: ["Users"],
    security: []
  });

  registry.registerPath({
    method: "post",
    path: "/api/users/refresh-token",
    operationId: "get new access token and refresh token ",
    summary: "return new access token and refresh token for specific user id",
    responses: {
      200: {
        description: "new token",
        content: { "application/json": { schema: schema.jwtschema } },
      },
      400: { description: "Validation error" },
     
    },
    tags: ["Users"],
    security: []
  });
  registry.registerPath({
    method: "patch",
    path: "/api/users",
    operationId: "update new infomation ",
    summary: "return status after update",
    request: {
      body: {
        required: true,
        content: {
          "multipart/form-data": {
            schema:schema.UpdateInputSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "update is successful",
      },
      400: { description: "Validation error" },
     
    },
    tags: ["Users"],
  });
  
  registry.registerPath({
    method: "get",
    path: "/api/users/invited",
    operationId: "get list of trip that user is invited ",
    summary: "return list of trip that user is invited",
  
    responses: {
      200: {
        description: "update is successful",
        content: { "application/json": { schema: schema.InvitedSchema} },
      },
      400: { description: "Validation error" },
     
    },
    tags: ["Users"],
  });

}
