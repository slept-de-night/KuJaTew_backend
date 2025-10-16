import { Request, Response, NextFunction } from 'express';
import { CopyService } from './copy.service';
import { copySchema } from './copy.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import { z, ZodError } from "zod";
import * as service from "./copy.service";
import * as schema from "./copy.schema";

export const Get_Copy = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
  if(!parsed.success) throw BadRequest("Invalide Request");
  let user_id = parsed.data.user_id;

  const parseparams = z.object({trip_id:z.coerce.number()}).safeParse(req.params);
  if (!parseparams.success) throw BadRequest("Invalide Request");
  const trip_id = parseparams.data.trip_id;
  const result = await CopyService.get_copy(trip_id);
  res.status(200).json(result);
});

export const Add_Copy = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
  if(!parsed.success) throw BadRequest("Invalide Request");
  let user_id = parsed.data.user_id;

  const parseparams = z.object({trip_id:z.coerce.number()}).safeParse(req.params);
  if (!parseparams.success) throw BadRequest("Invalide Request");
  const trip_id = parseparams.data.trip_id;
  const result = await CopyService.add_copy(trip_id, user_id);
  res.status(201).json(result);
});

export async function copy_trip(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const { trips_name, start_date, trip_code, trip_password } = schema.trip_code_schema.parse(req.body);

    const inserted = await service.copy_trip(trips_name, start_date, user_id, trip_id, trip_code, trip_password);
    if (inserted == 0) {
      return res.status(500).json({ message: "Copy Failed" });
    }
    return res.status(201).json({ message: "Trip Copied", trip_id: inserted });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}