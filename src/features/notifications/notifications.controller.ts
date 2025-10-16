import { Request, Response, NextFunction } from "express";
import * as service from "./notifications.service";
import * as schema from "./notifications.schema";
import { z, ZodError } from "zod";
import { BadRequest } from '../../core/errors';

export async function get_notifications(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id } = schema.get_notifications_schema.parse(req.params);

    const { list, count } = await service.get_noti(trip_id, user_id);

    return res.status(200).json({
      count,
      noti: list
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function post_notifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const { noti_title, noti_text, noti_date, noti_time } = schema.post_notifications_body_schema.parse(req.body);

    const inserted = await service.post_noti(trip_id, noti_title, noti_text, noti_date, noti_time);
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

export async function current_noti(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const count = await service.current_noti(user_id, trip_id);
    return res.status(200).json({ unseen: count });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}