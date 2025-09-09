import { Request, Response } from 'express';
import { MemberService } from './member.service';
import { MemberSchema, roleSchema, utcSchema, utSchema } from './member.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';
import { TripsService } from '../trips/trips.service';
import th from 'zod/v4/locales/th.js';

export const Trip_Members = asyncHandler(async (req: Request, res: Response) => {
  const parsed = utSchema.safeParse(req.params);
  if (!parsed.success) throw BadRequest("Invalid Request");
  const {trip_id, user_id} = parsed.data;
  const members = await MemberService.get_trip_member(user_id, trip_id);
  return res.status(200).json(members);
});

export const Edit_Role = asyncHandler(async (req: Request, res: Response) => {
  const parsedparams = utSchema.safeParse(req.params);
  if (!parsedparams.success) throw BadRequest("Invalid Params Request");
  const parsedbody = roleSchema.safeParse(req.body);
  if (!parsedbody.success) throw BadRequest("Invalid Body Request");

  const {user_id, trip_id} = parsedparams.data;
  const {collab_id, role} = parsedbody.data;
  const result = await MemberService.edit_role(user_id, trip_id, collab_id, role);
  return res.status(200).json(result);
});

export const Delete_Member = asyncHandler(async (req: Request, res: Response) => {
  const parsed = utcSchema.safeParse(req.params);
  if (!parsed.success) throw BadRequest("Invalid Request");
  const {user_id, trip_id, collab_id} = parsed.data;
  const result = await MemberService.delete_member(user_id, trip_id, collab_id);
  return res.status(200).json(result);
});