import { TripsRepo } from "./trips.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { TripSchema } from "./trips.schema";
import { env } from "../../config/env";
import { supabase } from "../../config/db";
import { tripsRouter } from "./trips.routes";

export const TripsService = {
  async get_user_trips(user_id: string) {
    if (!user_id) throw INTERNAL("User ID is required");
    const trips = await TripsRepo.get_user_trips(user_id);

    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        if (!trip.poster_image_link) return trip;
        const { data, error } = await supabase
          .storage
          .from("posters")
          .createSignedUrl(trip.poster_image_link, 3600);
        if (!error && data) {
          trip.poster_image_link = data.signedUrl;
        }
        return trip;
      })
    );

    return updatedTrips;
  },

  async get_specific_trip(trip_id: number) {
    if (!trip_id) throw INTERNAL("Trip ID is required");
    const trips = await TripsRepo.get_specific_trip(trip_id);
    
    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        if (!trip.poster_image_link) return trip;
        const { data, error } = await supabase
          .storage
          .from("posters")
          .createSignedUrl(trip.poster_image_link, 3600);
        if (!error && data) {
          trip.poster_image_link = data.signedUrl;
        }
        return trip;
      })
    );

    return updatedTrips;
  },

  async add_trip(
    user_id: string,
    title: string,
    start_date: Date,
    end_date: Date,
    trip_code: string,
    trip_pass: string,
    file?: Express.Multer.File
  ) {
    const trip = await TripsRepo.create_trip_base(
      user_id,
      title,
      start_date,
      end_date,
      trip_code,
      trip_pass
    );

    let picturePath: string | null = null;

    if (file) {
      const fileName = `${trip.trip_id}-${file.originalname}`;

      const { error } = await supabase.storage
        .from("posters")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw new Error(error.message);

      picturePath = fileName;

      await TripsRepo.update_trip_picture(trip.trip_id, picturePath);
    }
    await TripsRepo.add_owner_collab(trip.trip_id, user_id, "Owner", true);

    return { ...trip, poster_image_link: picturePath };
  },


  async add_owner_collab(trip_id: number, user_id: string){
    if (!trip_id || !user_id) throw INTERNAL("User ID AND Trip ID are required");
    const trips = await TripsRepo.add_owner_collab(trip_id, user_id, "Owner", true);
    return trips;
  },

  async delete_trip(user_id:string, trip_id:number){
    if (!user_id || !trip_id) throw INTERNAL("User ID AND Trip ID are required");
    const trips = await TripsRepo.delete_trip(user_id, trip_id);
    await TripsRepo.delete_trip_collab(trip_id);
    return trips;
  },

  async edit_trip_detail(owner_id:string, trip_id:number, title?:string, start_date?:Date, end_date?:Date, trip_code?:string, trip_pass?:string, planning_status?:boolean, file?: Express.Multer.File){
    if (!owner_id || !trip_id) throw INTERNAL("OwnerID and TripID are required");
    const isOwner = await TripsRepo.check_owner(owner_id, trip_id);
    if (!isOwner){
      throw new Error("Only Owner can edit trip detail");
    }

    const get_pic_path = await TripsRepo.get_trip_pic(trip_id);
    const old_pic_path = get_pic_path?.trip_picture_path ?? null;
    let trip_picture_path = old_pic_path;

    if (file) {
      const fileName = `${trip_id}-${file.originalname}`;
      const { error } = await supabase.storage
        .from("posters")
        .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
      if (error) throw error;

      trip_picture_path = fileName;
      if (old_pic_path){
        const { error } = await supabase.storage.from("posters").remove([old_pic_path]);
        if (error) {console.error("❌ Failed to delete:", error.message);}
      }
    }
    return await TripsRepo.edit_trip_detail(trip_id, title, start_date, end_date, trip_code, trip_pass, trip_picture_path, planning_status);
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

  async trip_sum(trip_id:number){
    if (!trip_id) throw INTERNAL("Trip ID is required");
    const trips = await TripsRepo.trip_sum(trip_id);
    
    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        if (!trip.poster_image_link) return trip;
        const { data, error } = await supabase
          .storage
          .from("posters")
          .createSignedUrl(trip.poster_image_link, 3600);
        if (!error && data) {
          trip.poster_image_link = data.signedUrl;
        }
        return trip;
      })
    );
    return updatedTrips;
    // maybe i should use get_file_link ของ fiat TT
    // got trip sum
    // need to do owner + member detail
    // + flight detail
  },
};