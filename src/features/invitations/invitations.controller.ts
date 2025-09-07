import { Request, Response, NextFunction } from "express";
import * as service from "./invitations.service";
import * as schema from "./invitations.schema";
import { ZodError } from "zod";

const TEST_USER_ID = "OSHI"; //for testing only

export async function invite(req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = TEST_USER_ID; //for testing only

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const {user_name } = schema.user_name_schema.parse(req.body);

    const invited = await service.invite(user_id, trip_id, user_name);
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
    const user_id = TEST_USER_ID; //for testing only

    const { trip_code, trip_password } = schema.trip_code_password_schema.parse(req.body);

    const joined = await service.code_join(user_id, trip_code, trip_password);
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
    const user_id = TEST_USER_ID; //for testing only

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
    const user_id = TEST_USER_ID; //for testing only

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const rejected = await service.reject_invite(trip_id, user_id);
    if (!rejected) {
      return res.status(200).json({ message: "user already reject invite" });
    }
    return res.status(201).json({ message: "rejected invite successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}