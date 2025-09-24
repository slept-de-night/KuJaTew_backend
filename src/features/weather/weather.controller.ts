import { ZodError } from "zod";
import * as S from "./weather.schema";
import { WeatherService } from "./weather.service";

export const WeatherController = {
  getByTripDate: async (req: any, res: any) => {
    try {
      const { trip_id, date } = S.GetWeatherParams.parse(req.params);
      await WeatherService.checkAndDelete(trip_id, date);
      const result = await WeatherService.getByTripDate(trip_id, date);
      return res.status(200).json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message ?? "Invalid input" });
      }
      console.error("[WeatherController.getByTripDate] error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
