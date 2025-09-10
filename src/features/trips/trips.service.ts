import { TripsRepo } from "./trips.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { TripSchema } from "./trips.schema";
import { env } from "../../config/env";
import { supabase } from "../../config/db";

export const TripsService = {
  async get_user_trips(user_id: string) {
    if (!user_id) throw INTERNAL("User ID is required");
    const trips = await TripsRepo.get_user_trips(user_id);
    return trips;
  },

  async get_specific_trip(trip_id: number) {
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
      const fileName = file.originalname;

      const { error } = await supabase.storage
        .from("posters")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw new Error(error.message);

      const { data } = await supabase.storage.from("posters").getPublicUrl(fileName);
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

  async edit_trip_detail(owner_id:string, trip_id:number, title?:string, start_date?:Date, end_date?:Date, trip_code?:string, trip_pass?:string, planning_status?:boolean, file?: Express.Multer.File){
    if (!owner_id || !trip_id) throw INTERNAL("OwnerID and TripID are required");
    const isOwner = await TripsRepo.check_owner(owner_id, trip_id);
    if (!isOwner){
      throw new Error("Only Owner can edit trip detail");
    }

    const get_pic = await TripsRepo.get_trip_pic(trip_id);
    const old_pic_url = get_pic.rows[0]?.trip_picture_url;
    if (old_pic_url) {
      const path = old_pic_url.split("/posters/")[1]; 
      if (path) {
        const { error } = await supabase.storage.from("posters").remove([path]);
          if (error) {
            console.error("❌ Failed to delete:", error.message);
          }
      }
    }

    let trip_picture_url = old_pic_url;
    if (file) {
      const fileName = file.originalname;
      const { error } = await supabase.storage
        .from("posters")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data } = supabase.storage
        .from("posters")
        .getPublicUrl(fileName);

      trip_picture_url = data.publicUrl;
    }

    return await TripsRepo.edit_trip_detail(trip_id, title, start_date, end_date, trip_code, trip_pass, trip_picture_url, planning_status);
  },

  async leave_trip(user_id:string, trip_id:number, collab_id?:number){
    const isOwner = await TripsRepo.check_owner(user_id, trip_id);
    if (!isOwner){// not an owner
      const result = await TripsRepo.leave_collab(user_id, trip_id);
      return result;
    } else {
      const member_id = await TripsRepo.get_userid_by_collabid(collab_id);
      const col = await TripsRepo.change_owner_in_collab('Owner', collab_id);
      const tri = await TripsRepo.change_owner_in_trips(trip_id, member_id);
      if (col && tri){// already change owner
        const result = await TripsRepo.leave_collab(user_id, trip_id);
        return result;
      } else {// can't change owner
        throw INTERNAL("Can't change owner");
      }
    }
  },
};