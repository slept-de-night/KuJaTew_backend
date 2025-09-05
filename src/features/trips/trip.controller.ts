import { Request, Response } from 'express';
import { TripsService } from './trips.service';
import { TripSchema } from './trips.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import axios from 'axios';
import z from 'zod';
import { parentPort } from 'node:worker_threads';
import { start } from 'node:repl';

export const User_All_Trip = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.string().safeParse((req.params.user_id));
  if(!parsed.success) throw BadRequest("Invalide Request");
  const trips_data = TripsService.get_user_trips(parsed.data);
  
  res.status(201).json(trips_data);
});

export const Specific_Trip = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.string().safeParse((req.params.trip_id));
	if(!parsed.success) throw BadRequest("Invalide Request");
	const trip_data = TripsService.get_specific_trip(parsed.data);

	res.status(201).json(trip_data);
});

export const Add_Trip = asyncHandler(async (req: Request, res: Response) => {
  try {
      const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
      if(!parsed.success) throw BadRequest("Invalide Request");
      const { title, start_date, end_date, trip_code, trip_pass } = req.body;
      const file = req.file;

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({ error: "Only .jpeg, .jpg, .png files are allowed" });
        }
      }

      const trip = await TripsService.add_trip(
        parsed.data.user_id,
        title,
        start_date,
        end_date,
        trip_code,
        trip_pass,
        file
      );

      res.status(201).json(trip);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
});

export const Delete_Trip = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  const { trip_id } = req.params;
  if (!trip_id) throw BadRequest("trip_id is required");

  const result = await TripsService.delete_trip(parsed.data.user_id, trip_id);

  res.status(200).json(result);
});