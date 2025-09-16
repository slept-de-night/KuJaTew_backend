import { INTERNAL } from "../../core/errors";
import { NotesRepo } from "./notes.repo";
import { UsersRepo } from "../users/users.repo";
import { MemberRepo } from "../member/member.repo";

export const NoteService = {
    async get_note_in_trip(user_id:string, trip_id:number){
        if (!user_id || !trip_id) throw INTERNAL("UserID and TripID required");
        const notes = await NotesRepo.get_note_in_trip(trip_id, user_id);

        const updatednotes = await Promise.all(
              notes.map(async (note) => {
                if (!note.profile_picture_path) {
                  return note;
                }
                const trip_pic = await UsersRepo.get_file_link(note.profile_picture_path, "profiles", 3600);
                note.profile_picture_path = trip_pic.signedUrl;
                return note;
              })
            );
        return updatednotes;
    },

    async edit_trip_note(user_id:string, trip_id:number, nit_id:number, note:string){
        if (!user_id || !trip_id || !nit_id || !note) throw INTERNAL("trip note detail required");
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("You not in trip");
        const result = await NotesRepo.edit_trip_note(nit_id, note);
        return result;
    },
}