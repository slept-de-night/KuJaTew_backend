import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as S from "./weather.schema";

export function registerWeather(registry: OpenAPIRegistry) {
  registry.register("WeatherItem", S.WeatherItem);
  registry.register("WeatherResponse", S.WeatherResponse);

  registry.registerPath({
    method: "get",
    path: "/api/weather/{trip_id}/{date}",
    operationId: "getWeatherByTripDate",
    summary: "Get weather bucket for the first place of a date (cached, 0..2 days)",
    description:
      "If date is within 0..2 days from system date, returns cached weather for that trip/date or fetches from WeatherAPI based on the first place of that date (is_event=false & is_vote=false). Otherwise returns {}.",
    tags: ["weather"],
    request: {
      params: S.GetWeatherParams,
    },
    responses: {
      200: {
        description: "Weather records for the date or empty object",
        content: {
          "application/json": {
            schema: S.WeatherResponse,
          },
        },
      },
      400: {
        description: "Invalid input",
      },
      500: {
        description: "Internal Server Error",
      },
    },
    security: [{ bearerAuth: [] }],
  });
}
