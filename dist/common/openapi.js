"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpenApiDoc = buildOpenApiDoc;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const places_info_openapi_1 = require("../features/places_info/places-info.openapi");
const trips_openapi_1 = require("../features/trips/trips.openapi");
const activity_openapi_1 = require("../features/activity/activity.openapi");
function buildOpenApiDoc() {
    const registry = new zod_to_openapi_1.OpenAPIRegistry();
    // Security (optional)
    registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });
    // Register all features
    (0, places_info_openapi_1.registerPlaceInfo)(registry);
    (0, trips_openapi_1.registerTrips)(registry);
    (0, activity_openapi_1.registerActivity)(registry);
    // registerUser(registry);
    const generator = new zod_to_openapi_1.OpenApiGeneratorV31(registry.definitions);
    const doc = generator.generateDocument({
        openapi: "3.0.4",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "Auto-generated from Zod schemas ).",
        },
        servers: [{ url: "http://localhost:3000" }],
        security: [{ bearerAuth: [] }], // if you use JWT
    });
    return doc;
}
//# sourceMappingURL=openapi.js.map