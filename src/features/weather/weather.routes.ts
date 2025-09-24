import express from "express";
import { WeatherController } from "./weather.controller";

export const weatherRouter = express.Router({ mergeParams: true });

weatherRouter.get("/:trip_id/:date", WeatherController.getByTripDate);
