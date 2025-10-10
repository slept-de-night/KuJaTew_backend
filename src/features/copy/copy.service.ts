import { CopyRepo } from "./copy.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { env } from "../../config/env";
import { supabase } from "../../config/db";
import { Result } from "pg";
import { copySchema } from "./copy.schema";
import * as repo from "./copy.repo";

export const CopyService = {
    async get_copy(trip_id:number){
        if (!trip_id) throw Error("TripID required");
        const result = await CopyRepo.get_trip_copy(trip_id);
        return result;
    },

    async add_copy(trip_id:number, user_id:string){
        if (!trip_id || !user_id) throw Error("TripID and UserID are required");
        const iscopy = await CopyRepo.check_copy(user_id, trip_id);
        if (iscopy){
            throw new Error("User already copied this trip");
        }
        const result = await CopyRepo.add_copy(user_id, trip_id);
        return result;
    },
}

export async function copy_trip(userId: string, trip_id: number, trip_code: string) {
  return repo.copy_trip(userId, trip_id, trip_code);
}