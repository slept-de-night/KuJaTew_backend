
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registerPlaceInfo } from "../features/places_info/places-info.openapi";
import { registerTrips } from "../features/trips/trips.openapi";
import { registerActivity } from "../features/activity/activity.openapi";
import { registerBookmarks } from "../features/bookmarks/bookmarks.openapi";
import { registerFlights } from "../features/flights/flights.openapi";
import { registerInvitations } from "../features/invitations/invitations.openapi";

export function buildOpenApiDoc() {
  const registry = new OpenAPIRegistry();

  // Security (optional)
  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  // Register all features
  registerPlaceInfo(registry);
  registerTrips(registry);
  registerActivity(registry);
  registerBookmarks(registry);
  registerFlights(registry);
  registerInvitations(registry)
  // registerUser(registry);

  const generator = new OpenApiGeneratorV31(registry.definitions);
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
