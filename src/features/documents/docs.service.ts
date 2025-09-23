import { DocsRepo } from "./docs.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { docSchema } from "./docs.schema";
import { env } from "../../config/env";
import { supabase } from "../../config/db";
import { MemberRepo } from "../member/member.repo";
import { Result } from "pg";

export const DocService = {
    async get_docs(user_id:string, trip_id:number){
        if (!user_id || !trip_id) throw Error("UserID and TripID required");
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");
        const result = await DocsRepo.get_docs(trip_id);
        return result;
    },
}