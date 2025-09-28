import { Request, Response } from 'express';
import { CopyService } from './copy.service';
import { copySchema } from './copy.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';

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