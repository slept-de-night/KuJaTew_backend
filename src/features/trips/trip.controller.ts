import { Request, Response } from 'express';
import { TripsService } from './trips.service';
import { mrSchema, TripSchema, tSchema, BodySchema, cSchema, addtripSchema } from './trips.schema';
import { ProfileFileSchema } from '../users/users.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';
import { TripsRepo } from './trips.repo';

export const User_All_Trip = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
  if(!parsed.success) throw BadRequest("Invalide Request");
  const trips_data = await TripsService.get_user_trips(parsed.data.user_id);
  res.status(200).json(trips_data);
});


export const Specific_Trip = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.string().transform(Number).safeParse((req.params.trip_id));
	if(!parsed.success) throw BadRequest("Invalide Request");
	const trip_data = await TripsService.get_specific_trip(parsed.data);

	res.status(200).json(trip_data);
});

export const Add_Trip = asyncHandler(async (req: Request, res: Response) => {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");

    const parsedbody = addtripSchema.safeParse(req.body);
    if (!parsedbody.success) throw BadRequest("Invalid Body Request");
    const file = req.file;
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error("Only JPEG, JPG, and PNG files are allowed");
      }
    }
    const body = parsedbody.data;
    const trip = await TripsService.add_trip(
      parsed.data.user_id,
      body.trip_name,
      body.start_date,
      body.end_date,
      body.trip_code,
      body.trip_pass,
      file
    );
    return res.status(201).json(trip);
    } catch (err: any) {
    if (err.code === "23503") return res.status(404).json({ error: "User not found" });
    return res.status(400).json({ error: err.message });
    }
});

export const Delete_Trip = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  const parsedtrip = tSchema.safeParse(req.params);
  if (!parsedtrip.success) {
    return res.status(400).json({ error: "Fail to parsed" });
  }
  const { user_id } = parsed.data;
  const { trip_id } = parsedtrip.data;
  const result = await TripsService.delete_trip(user_id, trip_id);
  return res.status(204).json(result);
});

export const Edit_Trip_Detail = asyncHandler(async (req: Request, res:Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");

  const parsedtrip = tSchema.safeParse(req.params);
  if (!parsedtrip.success) {
    return res.status(400).json({ error: "Fail to parsed params" });
  }
  const parsedbody = BodySchema.safeParse(req.body);
  if (!parsedbody.success) {
    return res.status(400).json({ error: "Fail to parsed body"});
  }
  const { user_id } = parsed.data;
  const { trip_id } = parsedtrip.data;
  const {trip_name, start_date, end_date, trip_code, trip_pass, planning_status} = parsedbody.data;

  const file = req.file;
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error("Only JPEG, JPG, and PNG files are allowed");
      }
    }
  const result = await TripsService.edit_trip_detail(user_id, trip_id, trip_name, start_date, end_date, trip_code, trip_pass, planning_status, file);
  return res.status(200).json(result);
});

export const Leave_Trip = asyncHandler(async (req: Request, res:Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  const { user_id } = parsed.data;

  const parsedtrip = tSchema.safeParse(req.params);
  if (!parsedtrip.success) {
    return res.status(400).json({ error: "Fail to parsed params" });
  }
  const { trip_id } = parsedtrip.data;
  const parsedbody = cSchema.safeParse(req.body);
  if (!parsedbody.success){
    return res.status(400).json({ error: "Fail to parsed body"});
  }
  const { collab_id } = parsedbody.data;
  
  const result = await TripsService.leave_trip(user_id, trip_id, collab_id);
  
  return res.status(204).json(result);
});

export const Trip_Sum = asyncHandler(async (req: Request, res:Response) =>{
  const parsed = z.string().transform(Number).safeParse((req.params.trip_id));
  if (!parsed.success) throw BadRequest("Invalid Request");

  const tripID = parsed.data;
  const tripinfo = await TripsService.trip_sum(tripID);
  return res.status(200).json(tripinfo);
});