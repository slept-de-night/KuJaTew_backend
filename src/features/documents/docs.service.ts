import { DocsRepo } from "./docs.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import * as scheme from './docs.schema';
import { env } from "../../config/env";
import { supabase } from "../../config/db";
import { MemberRepo } from "../member/member.repo";
import { Result } from "pg";
import { docsRouter } from "./docs.route";
import { UsersRepo } from "../users/users.repo";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export const DocService = {
    async uploadDocument(user_id:string, trip_id: number, file: Express.Multer.File) {
        //is in trip
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw new Error("User not in trip");

        //check role
        const role = await DocsRepo.check_role(user_id, trip_id);
        if (!role) throw new Error("User must be Owner or Editor to uploaded file");

        //check file size
        if (file.size > MAX_SIZE) throw new Error("File too large (>50MB)");

        const usedSize = await DocsRepo.getTotalSize(trip_id);
        if (usedSize + file.size > MAX_SIZE) throw new Error("Total size exceeds 50MB");

        //upload
        const filePath = `${trip_id}/${file.originalname}`;
        const { error: uploadErr } = await supabase
        .storage
        .from("documents")
        .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: true });

        if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

        //insert db
        return await DocsRepo.insertDocument(file.originalname, filePath, file.size, file.mimetype, trip_id);
    },

    async get_all_docs(user_id:string, trip_id:number){
        //is in trip
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw new Error("User not in trip");

        const result = await DocsRepo.get_all_docs(trip_id);
        return result;
    },

    async get_spec_doc(user_id:string, trip_id:number, doc_id:number){
        //is in trip
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw new Error("User not in trip");

        const result = await DocsRepo.get_path(doc_id);
        const filepath = result.path;
        const fileurl = await UsersRepo.get_file_link(filepath, "documents", 3600);
        return fileurl;
    },

    async delete_doc(user_id:string, trip_id:number, doc_id:number){
        //is in trip
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw new Error("User not in trip");

        //check role
        const role = await DocsRepo.check_role(user_id, trip_id);
        if (!role) throw new Error("User must be Owner or Editor to delete file");

        const {path} = await DocsRepo.get_path(doc_id);
        const { error } = await supabase.storage.from("documents").remove([path]);
        if (error) throw new Error(`Delete failed: ${error.message}`);
        const result = await DocsRepo.delete_doc(doc_id);
        return result;
    },
};