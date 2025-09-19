import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from "./bookmarks.schema";

export function registerBookmarks(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/users/bookmarks/places",
    operationId: "GetUserBookmarksPlaces",
    summary: "Get all bookmarked places for a user",
    tags: ["Bookmarks"],
    responses: {
      200: {
        description: "List of bookmarked places",
        content: {
          "application/json": {
            schema: schema.BookmarkPlaceList,
          },
        },
      },
      400: { description: "Validation error" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/users/bookmarks/places/{place_id}",
    operationId: "PostUserBookmarkPlace",
    summary: "Add place into user's bookmark",
    tags: ["Bookmarks"],
    request: {
      params: schema.PlaceIdParamSchema,
    },
    responses: {
      201: { description: "Place added to user's bookmark" },
      400: { description: "Validation error" },
      409: { description: "Place already bookmarked by user" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/users/bookmarks/places/{bookmark_id}",
    operationId: "DeleteUserBookmarkPlace",
    summary: "Remove place from user's bookmark",
    tags: ["Bookmarks"],
    request: {
      params: schema.BookmarkIdParamSchema,
    },
    responses: {
      200: { description: "Removed place from user's bookmark" },
      400: { description: "Validation error" },
      404: { description: "Place doesn't exist inside user's bookmark" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/users/bookmarks/guides",
    operationId: "GetUserBookmarksGuides",
    summary: "Get all bookmarked Guides for a user",
    tags: ["Bookmarks"],
    responses: {
      200: {
        description: "List of bookmarked Guides",
        content: {
          "application/json": {
            schema: schema.BookmarkGuideList,
          },
        },
      },
      400: { description: "Validation error" },
    },
  });

  // POST guide
  registry.registerPath({
    method: "post",
    path: "/api/users/bookmarks/guides/{trip_id}",
    operationId: "PostUserBookmarkGuide",
    summary: "Add guide into user's bookmark",
    tags: ["Bookmarks"],
    request: {
      params: schema.TripIdParamSchema,
    },
    responses: {
      201: { description: "Guide added to user's bookmark" },
      400: { description: "Validation error" },
      409: { description: "Guide already bookmarked by user" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/users/bookmarks/guides/{gbookmark_id}",
    operationId: "DeleteUserBookmarkGuide",
    summary: "Remove guide from user's bookmark",
    tags: ["Bookmarks"],
    request: {
      params: schema.GBookmarkIdParamSchema,
    },
    responses: {
      200: { description: "Removed Guide from user's bookmark" },
      400: { description: "Validation error" },
      404: { description: "Guide doesn't exist inside user's bookmark" },
    },
  });
}
