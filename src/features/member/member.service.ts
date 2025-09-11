import { MemberRepo } from "./member.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { MemberSchema } from "./member.schema";
import { env } from "../../config/env";
import { supabase } from "../../config/db";
import { TripsRepo } from "../trips/trips.repo";
import { memberRouter } from "./member.routes";

export const MemberService = {
  async get_trip_member(user_id: string, trip_id: number){
    if (!user_id || !trip_id) throw INTERNAL("UserID and TripID are required");
    const isin = await MemberRepo.is_in_trip(user_id, trip_id);
    if (!isin){
      throw new Error("Only trip member can do this");
    }
    return await MemberRepo.get_trip_members(trip_id);
  },

  async edit_role(user_id:string, trip_id:number, collab_id: number, role:string){
    const isOwner = await TripsRepo.check_owner(user_id, trip_id);
    if (!isOwner) {
      throw new Error("Only trip owner can do this");
    }
    return await MemberRepo.edit_role(role, trip_id, collab_id);
  },

  async delete_member(user_id:string, trip_id:number, collab_id: number){
    const isOwner = await TripsRepo.check_owner(user_id, trip_id);
    if (!isOwner) {
      throw new Error("Only trip owner can do this");
    }
    return await MemberRepo.delete_member(collab_id, trip_id);
  },

  async get_memberid(trip_id: number){
    if (!trip_id) throw INTERNAL("UserID and TripID are required");
    const result = await MemberRepo.get_trip_members(trip_id);
    return result;
  },
};