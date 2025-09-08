import { TripsRepo } from "./trips.repo";
import { UsersRepo } from "../users/users.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { TripSchema } from "./trips.schema";
import { env } from "../../config/env";
import z, { check, string } from 'zod';
import { supabase } from "../../config/db";
import path from "node:path";

export const TripsService = {
  async get_user_trips(user_id: string) {
    if (!user_id) throw INTERNAL("User ID is required");
    const trips = await TripsRepo.get_user_trips(user_id);
    return trips;
  },

  async get_specific_trip(trip_id: string) {
    if (!trip_id) throw INTERNAL("Trip ID is required");
    const trip = await TripsRepo.get_specific_trip(trip_id);
    return trip;
  },

  async add_trip(
    user_id: string, 
    title: string, 
    start_date: Date, 
    end_date: Date, 
    trip_code:string, 
    trip_pass:string, 
    file?: Express.Multer.File)
    {
    let pictureUrl: string | null = null;

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${user_id}-${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("trip-pictures")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw new Error(error.message);

      const { data } = await supabase.storage.from("trip-pictures").getPublicUrl(fileName);
      pictureUrl = data.publicUrl;
    }

    return await TripsRepo.add_trip(
      user_id,
      title,
      start_date,
      end_date,
      trip_code,
      trip_pass,
      pictureUrl
    );
  },

  async add_owner_collab(trip_id: number, user_id: string){
    if (!trip_id || !user_id) throw INTERNAL("User ID AND Trip ID are required");
    const trips = await TripsRepo.add_owner_collab(trip_id, user_id, "Owner", true);
    return trips;
  },

  async delete_trip(user_id:string, trip_id:number){
    if (!user_id || !trip_id) throw INTERNAL("User ID AND Trip ID are required");
    const trips = await TripsRepo.delete_trip(user_id, trip_id);
    return trips;
  },

  async edit_trip_role(owner_id:string, member_id:string, trip_id:number, role:string){
    if (!member_id || !trip_id || !role) throw INTERNAL("MemberID, Trip_id and Role required");
    const isOwner = await TripsRepo.check_owner(owner_id, trip_id);
    if (!isOwner){
      throw new Error("Only Owner can edit member role");
    }
    return await TripsRepo.edit_trip_role(member_id, trip_id, role);
  },
};