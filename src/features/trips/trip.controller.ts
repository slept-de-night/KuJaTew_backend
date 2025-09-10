import { Request, Response } from 'express';
import { TripsService } from './trips.service';
import { mrSchema, TripSchema, utSchema, BodySchema, cSchema } from './trips.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';
import { TripsRepo } from './trips.repo';

export const User_All_Trip = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.params.user_id || "").trim();
  const parsed = z.string().min(1).safeParse(userId);
  if (!parsed.success) throw BadRequest("Invalid Request");

  const trips_data = await TripsService.get_user_trips(parsed.data);
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
    const ParamsSchema = z.object({
      user_id: z.string().trim().min(1, "user_id required"),
    });
    const parsedParams = ParamsSchema.parse(req.params);
    const userId = parsedParams.user_id;

    const BodySchema = z.object({
      trip_name: z.string().trim().min(1),
      start_date: z.coerce.date(),
      end_date: z.coerce.date(),
      trip_code: z.string().trim().min(1, "trip_code required"),
      trip_pass: z.string().trim().min(1, "trip_pass required"),
    });
    const body = BodySchema.parse(req.body);
    const file = req.file;
    if (file) {
      const allowed = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowed.includes(file.mimetype)) {
        return res.status(400).json({ error: "Only .jpeg, .jpg, .png files are allowed" });
      }
    }

    const trip = await TripsService.add_trip(
      userId,
      body.trip_name,
      body.start_date,
      body.end_date,
      body.trip_code,
      body.trip_pass,
      file
    );
    await TripsService.add_owner_collab(trip.trip_id, userId);
    return res.status(201).json(trip);
    } catch (err: any) {
    if (err.code === "23503") return res.status(404).json({ error: "User not found" });
    return res.status(400).json({ error: err.message });
    }
});

export const Delete_Trip = asyncHandler(async (req: Request, res: Response) => {
  const parsed = utSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Fail to parsed" });
  }

  const { user_id, trip_id } = parsed.data;
  const result = await TripsService.delete_trip(user_id, trip_id);
  return res.status(200).json(result);
});

export const Edit_Trip_Detail = asyncHandler(async (req: Request, res:Response) => {
  const parsedparams = utSchema.safeParse(req.params);
  if (!parsedparams.success) {
    return res.status(400).json({ error: "Fail to parsed params"});
  }
  const parsedbody = BodySchema.safeParse(req.body);
  if (!parsedbody.success) {
    return res.status(400).json({ error: "Fail to parsed body"});
  }
  const {user_id, trip_id} = parsedparams.data;
  const {trip_name, start_date, end_date, trip_code, trip_pass, planning_status} = parsedbody.data;

  const file = req.file;
    if (file) {
      const allowed = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowed.includes(file.mimetype)) {
        return res.status(400).json({ error: "Only .jpeg, .jpg, .png files are allowed" });
      }
    }
  const result = await TripsService.edit_trip_detail(user_id, trip_id, trip_name, start_date, end_date, trip_code, trip_pass, planning_status, file);
  return res.status(200).json(result);
});

export const Leave_Trip = asyncHandler(async (req: Request, res:Response) => {
  const parsedparams = utSchema.safeParse(req.params);
  if (!parsedparams.success) {
    return res.status(400).json({ error: "Fail to parsed params"});
  }
  const parsedbody = cSchema.safeParse(req.body);
  if (!parsedbody.success){
    return res.status(400).json({ error: "Fail to parsed body"});
  }
  
  const {user_id, trip_id} = parsedparams.data;
  const {collab_id} = parsedbody.data;
  console.log(user_id, trip_id, collab_id);
  const result = await TripsService.leave_trip(user_id, trip_id, collab_id);
  
  return res.status(200).json(result);
});