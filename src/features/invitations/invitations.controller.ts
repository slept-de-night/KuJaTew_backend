import { Request, Response, NextFunction } from "express";
import * as service from "./invitations.service";
import * as schema from "./invitations.schema";
import { z, ZodError } from "zod";
import { BadRequest } from '../../core/errors';

export async function invite(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const { name } = schema.user_name_schema.parse(req.body);

    const invited = await service.invite(user_id, trip_id, name);
    if (!invited) {
      return res.status(200).json({ message: "user already invited" });
    }
    return res.status(201).json({ message: "Invite successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function code_join(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_code, trip_pass } = schema.trip_code_password_schema.parse(req.body);

    const joined = await service.code_join(user_id, trip_code, trip_pass);
    if (!joined) {
      return res.status(200).json({ message: "user already joined" });
    }
    return res.status(201).json({ message: "join successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function accept_invite(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;
    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const accepted = await service.accept_invite(trip_id, user_id);
    if (!accepted) {
      return res.status(200).json({ message: "user already accept invite" });
    }
    return res.status(201).json({ message: "accept invite successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function reject_invite(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const rejected = await service.reject_invite(trip_id, user_id);
    if (!rejected) {
      return res.status(200).json({ message: "user already reject invite" });
    }
    return res.status(201).json({ message: "reject invite successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}