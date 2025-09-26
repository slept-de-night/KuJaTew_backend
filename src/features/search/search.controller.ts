import { Request, Response } from 'express';
import { searchService } from './search.service';
import { userschema } from './search.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';
import { TripsService } from '../trips/trips.service';
import th from 'zod/v4/locales/th.js';

export const SearchUser = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
  if(!parsed.success) throw BadRequest("Invalide Request");
  let user_id = parsed.data.user_id;

  const parsedparams = z.object({username:z.string().min(1)}).safeParse(req.params);
  if (!parsedparams.success) throw BadRequest("Invalid Request");
  const {username} = parsedparams.data;
  const users = await searchService.search_user(username);
  return res.status(200).json(users);
});

export const SearchGuide = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
  if(!parsed.success) throw BadRequest("Invalide Request");
  let user_id = parsed.data.user_id;

  const parsedparams = z.object({guide_name:z.string().min(1)}).safeParse(req.params);
  if (!parsedparams.success) throw BadRequest("Invalid Request");
  const {guide_name} = parsedparams.data;
  const guides = await searchService.search_guide(guide_name);
  return res.status(200).json(guides);
});