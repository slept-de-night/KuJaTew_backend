"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTrips = registerTrips;
const schema = __importStar(require("./trips.schema"));
const zod_1 = require("zod");
function registerTrips(registry) {
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
                            trip_image: zod_1.z.string().openapi({
                                type: "string",
                                format: "binary",
                            }).optional(),
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
                            trip_image: zod_1.z.string().openapi({
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
            body: {
                description: "Adding collab_id (for change owner/optional)",
                content: {
                    "application/json": {
                        schema: schema.cSchema,
                    },
                },
            },
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
//# sourceMappingURL=trips.openapi.js.map