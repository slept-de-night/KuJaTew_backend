import { Request, Response, NextFunction } from "express";
import * as service from "./flights.service";
import * as schema from "./flights.schema";
import { ZodError } from "zod";

const TEST_USER_ID = "OSHI"

export async function get_flight(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const flights = await service.get_flight(trip_id);
    return res.status(200).json({ flights });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function delete_flight(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id, flight_id } = schema.delete_flight_schema.parse(req.params);

    const deleted = await service.delete_flight(trip_id, flight_id);
    if (!deleted) {
      return res.status(404).json({ message: "flight not found" });
    }
    return res.status(200).json({ message: "flight removed" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function post_flight(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id } = schema.trip_id_schema.parse(req.params);
    const body = schema.CreateFlightBodySchema.parse(req.body);

    const row = await service.post_flight(body, trip_id);
    return res.status(201).json(row);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function put_flight(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id } = schema.trip_id_schema.parse(req.params);
    const body = schema.CreateFlightBodySchema.parse(req.body);

    const row = await service.post_flight(body, trip_id);
    return res.status(201).json(row);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}