
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registerPlaceInfo } from "../features/places_info/places-info.openapi";
import { registerUsers } from "../features/users/users.openapi";

import { registerTrips } from "../features/trips/trips.openapi";
import { registerActivity } from "../features/activity/activity.openapi";
import { registerWeather } from "../features/weather/weather.openapi";
import { registerBookmarks } from "../features/bookmarks/bookmarks.openapi";
import { registerFlights } from "../features/flights/flights.openapi";
import { registerInvitations } from "../features/invitations/invitations.openapi";
import { registerMembers } from "../features/member/members.openapi";
import { $ZodRegistry } from "zod/v4/core";
import { registerNotes } from "../features/notes/notes.openapi";

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

  registerUsers(registry);

  registerTrips(registry);
  registerMembers(registry);
  registerNotes(registry);
  
  registerActivity(registry);
  registerWeather(registry);
  registerBookmarks(registry);
  registerFlights(registry);
  registerInvitations(registry);
  // registerUser(registry);

  const generator = new OpenApiGeneratorV31(registry.definitions);
  const doc = generator.generateDocument({
    openapi: "3.0.4",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Auto-generated from Zod schemas ).",
    },
    servers: [{ url: "/" }],
    security: [{ bearerAuth: [] }], // if you use JWT
  });

  return doc;
}
