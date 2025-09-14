import { Router } from "express";
import * as controller from "./flights.controller";

export const flightRouter = Router();

flightRouter.post("/:trip_id/flights", controller.post_flight) //Done || Not tested yet
flightRouter.get("/:trip_id/flights", controller.get_flight) //Done || Not tested yet

flightRouter.put("/:trip_id/flights/:flight_id", controller.put_flight) //Done || Not tested yet
flightRouter.delete("/:trip_id/flights/:flight_id", controller.delete_flight) //Done || Not tested yet