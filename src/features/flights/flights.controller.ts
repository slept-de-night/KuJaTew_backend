import { Request, Response, NextFunction } from "express";
import * as service from "./flights.service";
import * as schema from "./flights.schema";
import { z, ZodError } from "zod";
import { BadRequest } from '../../core/errors';

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
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id, flight_id } = schema.trip_flight_schema.parse(req.params);

    const deleted = await service.delete_flight(user_id, trip_id, flight_id);
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
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id } = schema.trip_id_schema.parse(req.params);
    const body = schema.CreateFlightBodySchema.parse(req.body);

    const added = await service.post_flight(user_id, body, trip_id);
    if (!added) {
      return res.status(200).json({ message: "flight already exist in trip" });
    }
    return res.status(201).json({ message: "flight added" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function put_flight(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id, flight_id } = schema.trip_flight_schema.parse(req.params);
    const body = schema.CreateFlightBodySchema.parse(req.body);

    const updated = await service.put_flight(user_id, body, trip_id, flight_id);
    if(!updated) {
      return res.status(404).json( { message: "Flight Not found"} );
    }
    return res.status(201).json( { message: "Flight updated"} );
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}