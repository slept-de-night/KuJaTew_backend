import { Request, Response, NextFunction } from "express";
import * as service from "./flights.service";
import * as schema from "./flights.schema";
import { ZodError } from "zod";

export async function delete_flight(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id, flight_id } = schema.delete_flight_schema.parse(req.params);

    const removed = await service.delete_flight(Number(trip_id), Number(flight_id));
    if (!removed) {
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

export async function create_flight(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id } = schema.trip_id_schema.parse(req.params); // still from URL
    const body = schema.create_flight_body_schema.parse(req.body);

    const created = await service.post_flight(body, trip_id);

    return res.status(201).json({
      message: "flight created",
      flight: created,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}
