
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registerPlaceInfo } from "../features/places_info/places-info.openapi";

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
