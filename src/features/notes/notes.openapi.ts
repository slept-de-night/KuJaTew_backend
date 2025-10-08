import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as schema from './notes.schema'
import {z} from "zod";

// ---------------- OVERVIEW NOTES ----------------
export function registerNotes(registry: OpenAPIRegistry) {
    // Get all overview notes for a trip
    registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/notes",
    operationId: "GetOverviewNotes",
    summary: "Get all overview notes for a trip",
    request: {
        params: z.object({
        trip_id: z.number().int(),
        }),
    },
    responses: {
        200: {
        description: "List of overview notes",
        content: {
            "application/json": {
            schema: z.array(schema.noteintripschema),
            },
        },
        },
    },
    tags: ["Overview Notes"],
    });

    // Create an overview note
    registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/notes",
    operationId: "CreateOverviewNote",
    summary: "Create a new overview note in a trip",
    request: {
        params: z.object({
        trip_id: z.number().int(),
        }),
        body: {
        content: {
            "application/json": {
            schema: z.object({note: z.string()}),
            },
        },
        },
    },
    responses: {
        201: {
        description: "Created overview note",
        content: {
            "application/json": {
            schema: schema.noteintripschema,
            },
        },
        },
    },
    tags: ["Overview Notes"],
    });

    // Edit an overview note
    registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/{nit_id}/notes",
    operationId: "EditOverviewNote",
    summary: "Edit a specific overview note",
    request: {
        params: z.object({
            trip_id: z.number().int(),
            nit_id: z.number().int(),
        }),
        body: {
        content: {
            "application/json": {
            schema: z.object({
                note: z.string(),
            }),
            },
        },
        },
    },
    responses: {
        200: {
        description: "Updated overview note",
        content: {
            "application/json": {
            schema: schema.noteintripschema,
            },
        },
        },
    },
    tags: ["Overview Notes"],
    });

    // Delete an overview note
    registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/{nit_id}/notes",
    operationId: "DeleteOverviewNote",
    summary: "Delete an overview note",
    request: {
        params: z.object({
            trip_id: z.number().int(),
            nit_id: z.number().int(),
        }),
    },
    responses: {
        204: {
        description: "Overview note deleted successfully",
        },
    },
    tags: ["Overview Notes"],
    });

    // ---------------- ACTIVITY NOTES ----------------

    // Get all activity notes for a trip
    registry.registerPath({
    method: "get",
    path: "/api/trips/{trip_id}/act_notes",
    operationId: "GetActivityNotes",
    summary: "Get all activity notes for a trip",
    request: {
        params: z.object({
            trip_id: z.number().int(),
        }),
    },
    responses: {
        200: {
        description: "List of activity notes",
        content: {
            "application/json": {
            schema: z.array(schema.noteactivityschema),
            },
        },
        },
    },
    tags: ["Activity Notes"],
    });

    // Create an activity note
    registry.registerPath({
    method: "post",
    path: "/api/trips/{trip_id}/{pit_id}/act_notes",
    operationId: "CreateActivityNote",
    summary: "Create a new activity note in a trip",
    request: {
        params: z.object({
            trip_id: z.number().int(),
            pit_id: z.number().int(),
        }),
        body: {
        content: {
            "application/json": {
                schema: z.object({
                    note: z.string(),
                }),
            },
        },
        },
    },
    responses: {
        201: {
        description: "Created activity note",
        content: {
            "application/json": {
            schema: schema.noteactivityschema,
            },
        },
        },
    },
    tags: ["Activity Notes"],
    });

    // Edit an activity note
    registry.registerPath({
    method: "patch",
    path: "/api/trips/{trip_id}/{pnote_id}/act_notes",
    operationId: "EditActivityNote",
    summary: "Edit a specific activity note",
    request: {
        params: z.object({
            trip_id: z.number().int(),
            pnote_id: z.number().int(),
        }),
        body: {
        content: {
            "application/json": {
            schema: z.object({
                    note: z.string(),
                }),
            },
        },
        },
    },
    responses: {
        200: {
        description: "Updated activity note",
        content: {
            "application/json": {
            schema: schema.noteactivityschema,
            },
        },
        },
    },
    tags: ["Activity Notes"],
    });

    // Delete an activity note
    registry.registerPath({
    method: "delete",
    path: "/api/trips/{trip_id}/{pnote_id}/act_notes",
    operationId: "DeleteActivityNote",
    summary: "Delete an activity note",
    request: {
        params: z.object({
            trip_id: z.number().int(),
            pnote_id: z.number().int(),
        }),
    },
    responses: {
        204: {
        description: "Activity note deleted successfully",
        },
    },
    tags: ["Activity Notes"],
    })
};
