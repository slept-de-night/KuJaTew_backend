import { Request, Response, NextFunction } from "express";
import * as service from "./notifications.service";
import * as schema from "./notifications.schema";
import { ZodError } from "zod";

export async function get_notifications(req: Request, res: Response, next: NextFunction) {
  try {
    const {trip_id, limit} = schema.get_notifications_schema.parse(req.params);

    const noti = await service.get_noti(trip_id, limit);
    return res.status(200).json({ noti });
  } catch (err) {
    next(err);
  }
}

export async function post_notifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const { noti_text, noti_time } = schema.post_notifications_body_schema.parse(req.params);

    const inserted = await service.post_noti(trip_id, noti_text, noti_time);
    if (!inserted) {
      return res.status(200).json({ message: "Notification already exist" });
    }
    return res.status(201).json({ message: "Notification added" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}
