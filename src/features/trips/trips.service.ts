import { TripsRepo } from "./trips.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { TripSchema } from "./trips.schema";
import { env } from "../../config/env";
import { supabase } from "../../config/db";
import { tripsRouter } from "./trips.routes";
import { UsersRepo } from "../users/users.repo";
import { MemberRepo } from "../member/member.repo";
import { UsersService } from "../users/users.service";
import * as Flightservice from "../flights/flights.service";
import { promise } from "zod";
import { all } from "axios";
import { etcService } from "../../etc/etc.service";

export const TripsService = {
  async get_user_trips(user_id: string) {
    if (!user_id) throw INTERNAL("User ID is required");
    const trips = await TripsRepo.get_user_trips(user_id);

    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        if (!trip.poster_image_link) {
          return trip;
        }
        const trip_pic = await UsersRepo.get_file_link(trip.poster_image_link, "posters", 3600);
        trip.poster_image_link = trip_pic.signedUrl;
        return trip;
      })
    );

    return { trips : updatedTrips};
  },

  async get_specific_trip(trip_id: number) {
    if (!trip_id) throw INTERNAL("Trip ID is required");
    const trips = await TripsRepo.get_specific_trip(trip_id);
    
    const filepath = trips.poster_image_link;
    if (!filepath) {
      return trips;
    } else {
      const trip_pic = await etcService.get_file_link(filepath, "posters", 3600);
      trips.poster_image_link = trip_pic.signedUrl;
      return trips;
    }
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

    const isOwner = await TripsRepo.check_owner(user_id, trip_id);
    if (!isOwner) throw new Error("Only trip owner can delete trip");
    const pic = await TripsRepo.get_specific_trip(trip_id);
    const old_pic_path = pic.poster_image_link;
    if (old_pic_path){
      const { error } = await supabase.storage.from("posters").remove([old_pic_path]);
      if (error) {console.error("Failed to delete:", error.message);}
    }
    const trips = await TripsRepo.delete_trip(user_id, trip_id);
    return trips;
  },

  async edit_trip_detail(
    owner_id:string, 
    trip_id:number, 
    title?:string,
    start_date?:Date, 
    end_date?:Date, 
    trip_code?:string, 
    trip_pass?:string, 
    planning_status?:boolean,
		visibility_status?:boolean,
		budget?:number, 
		description?:string,
    file?: Express.Multer.File){

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
        if (error) {console.error("Failed to delete:", error.message);}
      }
    }
    return await TripsRepo.edit_trip_detail(trip_id,title,start_date,end_date,trip_code,trip_pass,trip_picture_path,planning_status, visibility_status, budget, description);
  },

  async leave_trip(user_id:string, trip_id:number, collab_id?:number){
    const isOwner = await TripsRepo.check_owner(user_id, trip_id);
    const joinedP = await TripsRepo.get_joinedP(trip_id);
    if (!isOwner){// not an owner
      const result = await TripsRepo.leave_collab(user_id, trip_id);
      return result;
    }
    if (isOwner && (joinedP == 1)) {// leave and delete trip
      const result = await TripsRepo.delete_trip(user_id, trip_id);
      return result;
    }
    if (!collab_id) {
      throw new Error("collab_id required when owner leaves with other members");
    }
    else {
      const result = await TripsRepo.transferOwner(user_id, trip_id, collab_id);
      return result;
    }
  },

  async trip_sum(trip_id:number){
    if (!trip_id) throw INTERNAL("Trip ID is required");
    const trip_detail = await TripsRepo.trip_sum(trip_id);
    // get trip file link
    const filepath = trip_detail.poster_image_link;
    if (!filepath) {}
    else {
      const trip_pic = await etcService.get_file_link(filepath, "posters", 3600);
      trip_detail.poster_image_link = trip_pic.signedUrl;
    }
    // get owner & members detail
    const all_members = await MemberRepo.get_memberid(trip_id);
    const owner = all_members.find(m => m.role === "Owner")!;
    const members = all_members.filter(m => m.role !== "Owner");
    const owner_detail = await UsersService.get_user_details(owner?.user_id);
    const members_detail = await Promise.all(
      members.map(async (member) => {
        if(!member.user_id) throw INTERNAL("Error trip.service.trip_sum");
          return await UsersService.get_user_details(member.user_id);
      })  
    );
    

    const flight = await Flightservice.get_flight(trip_id);
    const flight_detail = flight.map((f: any) => ({
      flight_id: f.flight_id,
      depart: {
        dep_date: f.depart_date,
        dep_time: f.depart_time,
        dep_country: f.dep_country,
        dep_airp_code: f.dep_airport_code,
      },
      arrive: {
        arr_date: f.arrive_date,
        arr_time: f.arrive_time,
        arr_country: f.arr_country,
        arr_airp_code: f.arr_airport_code,
      },
      airl_name: f.airline,
    }));

    return {
      trip_detail,
      owner_detail,
      members_detail,
      flight_detail,
    };
  },

  async get_recommended_trip(){
    const trips = await TripsRepo.get_recommended_trip();
    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        if (trip.owner_image){
          const owner_pic = await etcService.get_file_link(trip.owner_image, "profiles", 3600);
          trip.owner_image = owner_pic.signedUrl;
        }
        if (trip.guide_image) {
          const guide_pic = await etcService.get_file_link(trip.guide_image, "posters", 3600);
          trip.guide_image = guide_pic.signedUrl;
        }
        return trip;
      })
    );
    return { guides: updatedTrips};
  },

  async get_invited_trips(user_id:string){
    if(!user_id) throw BadRequest("UserID is required");
    const trips = await TripsRepo.get_invited_trips(user_id);
    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        if (trip.owner_image){
          const owner_pic = await etcService.get_file_link(trip.owner_image, "profiles", 3600);
          trip.owner_image = owner_pic.signedUrl;
        }
        if (trip.guide_image) {
          const guide_pic = await etcService.get_file_link(trip.guide_image, "posters", 3600);
          trip.guide_image = guide_pic.signedUrl;
        }
        return trip;
      })
    );
    return { trips: updatedTrips};
  },
};