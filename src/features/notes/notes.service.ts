import { INTERNAL } from "../../core/errors";
import { NotesRepo } from "./notes.repo";
import { UsersRepo } from "../users/users.repo";
import { MemberRepo } from "../member/member.repo";

export const NoteService = {
  // overview part
    async get_overview_notes(user_id:string, trip_id:number){
        if (!user_id || !trip_id) throw INTERNAL("UserID and TripID required");
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");

        const notes = await NotesRepo.get_overview_notes(trip_id, user_id);
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

    async edit_overview_note(user_id:string, trip_id:number, nit_id:number, note:string){
        if (!user_id || !trip_id || !nit_id || !note) throw INTERNAL("trip note detail required");
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");
        const result = await NotesRepo.edit_trip_note(nit_id, note);
        return result;
    },
 
    async add_overview_note(user_id:string, trip_id:number, note:string){
      if (!user_id || !trip_id) throw INTERNAL("UserID and TripID are required");
      const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");
      const {collab_id} = await NotesRepo.get_collabID(user_id, trip_id);
      const total_note = await NotesRepo.check_nit(collab_id, trip_id);
      if (total_note.total_note){ //total_note == 1 --> can't add more
        throw new Error("User already add overview note");
      }
      const result = await NotesRepo.add_overview_note(collab_id, trip_id, note);
      return result;
    },

    async delete_overview_note(user_id:string, trip_id:number, nit_id:number){
      if (!user_id || !trip_id || !nit_id) throw INTERNAL("UserID, TripID and nitID are required");
      const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");
      const {collab_id} = await NotesRepo.get_collabID(user_id, trip_id);
      const result = await NotesRepo.delete_overview_note(collab_id,nit_id);
      return result;
    },
  //activity part
    async get_activity_notes(user_id:string, trip_id:number, pit_id:number){
        if (!user_id || !trip_id || !pit_id) throw INTERNAL("UserID, TripID and pitID required");
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");

        const {collab_id} = await NotesRepo.get_collabID(user_id, trip_id);
        const notes = await NotesRepo.get_activity_notes(trip_id, collab_id, pit_id);
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

    async edit_activity_note(user_id:string, trip_id:number, pnote_id:number, note:string){
        if (!user_id || !trip_id || !pnote_id || !note) throw INTERNAL("activity note detail required");
        const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");
        const result = await NotesRepo.edit_activity_note(pnote_id, note);
        return result;
    },

    async add_activity_note(user_id:string, trip_id:number, pit_id:number, note:string){
      if (!user_id || !trip_id || !pit_id) throw INTERNAL("UserID, TripID and pitID are required");
      const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");
      const {collab_id} = await NotesRepo.get_collabID(user_id, trip_id);
      const total_note = await NotesRepo.check_n(collab_id, trip_id, pit_id);
      if (total_note.total_note){ //total_note == 1 --> can't add more
        throw new Error("User already add activity note");
      }
      const result = await NotesRepo.add_activity_note(collab_id, trip_id, note, pit_id);
      return result;
    },

    async delete_activity_note(user_id:string, trip_id:number, pnote_id:number){
      if (!user_id || !trip_id || !pnote_id) throw INTERNAL("UserID, TripID and pnoteID are required");
      const iit = await MemberRepo.is_in_trip(user_id, trip_id);
        if (!iit) throw Error("User not in trip");
      const {collab_id} = await NotesRepo.get_collabID(user_id, trip_id);
      const result = await NotesRepo.delete_activity_note(collab_id, pnote_id);
      return result;
    },
}