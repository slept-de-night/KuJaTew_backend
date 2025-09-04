import { UsersRepo, User } from "./users.repo";
import { BadRequest } from "../../core/errors";
import { InvitedSchema, JWT_OBJ, ProfileFile,UsersFullSchema } from "./users.schema";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";
import { gen_jwt_token } from "../../core/jwt,generator";
import z from 'zod';
import { supabase } from "../../config/db";
import path from "node:path";

export const UsersService = {
    async create_user(input: User& {"email":string}, profile: ProfileFile | null | undefined): Promise<User & { user_id: string,profile_picture_link:string }> {
        
        const created_user = await UsersRepo.create_user(input);
        if (profile) {
            const upload_profile = await UsersRepo.upload_profile(profile, created_user.user_id);
            console.log(upload_profile.fullPath)
            await UsersRepo.update_profile_path(upload_profile.path, created_user.user_id);
            created_user.profile_picture_path = upload_profile.path;
            const profile_link = await UsersRepo.get_file_link(upload_profile.path,"profiles",3600);
            return { ...created_user ,profile_picture_link:profile_link.signedUrl};
        }
        return { ...created_user ,profile_picture_link:""}; 
    },
    async google_verify(idToken: string) {
        const googleClient = new OAuth2Client("999598547228-cgjn9gspjg2d1m2m2q3rp277ovl58qhb.apps.googleusercontent.com");
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: ["999598547228-cgjn9gspjg2d1m2m2q3rp277ovl58qhb.apps.googleusercontent.com"], // include all that your app uses
        });
        const payload = ticket.getPayload(); 

        if (!payload) throw BadRequest("Invalid token");
        if (env.GOOGLE_ANDROID_CLIENT_ID != payload.azp) throw BadRequest("Invalid Application Request");
        console.log(payload);
        return payload;
    },
    async gen_jwt(user_id:string):Promise<JWT_OBJ>{
        const acc_tk = gen_jwt_token(env.JWT_ACCESS_SECRET,{"user_id":user_id},'1h');
        const ref_tk = gen_jwt_token(env.JWT_REFRESH_SECRET,{"user_id":user_id},'30d');
        return {Access_token:acc_tk,Refresh_token:ref_tk}
    },
    async get_user_details(user_id:string):Promise<Omit<z.infer<typeof UsersFullSchema>,'profile_picture_path'> &{'profile_picture_link':string}>{
        const user_data = await UsersRepo.get_user_details(user_id);
        const {profile_picture_path,...remians} = user_data;
        const profile_link = await UsersRepo.get_file_link(user_data.profile_picture_path,"profiles",3600);
        return {...remians,'profile_picture_link': profile_link.signedUrl};

    },
    async update_user(input: User ,user_id:string, profile: ProfileFile | null | undefined) {
        await UsersRepo.update_user(input,user_id);
        if (profile) {
            const upload_profile = await UsersRepo.upload_profile(profile, user_id);
            await UsersRepo.update_profile_path(upload_profile.fullPath, user_id);
        }
        
    },
    async get_user_details_byemail(email:string):Promise<Omit<z.infer<typeof UsersFullSchema>,'profile_picture_path'> &{'profile_picture_link':string}|null>{
        const user_data = await UsersRepo.get_user_details_byemail(email);
        if (!user_data) return null;
        const {profile_picture_path,...remians} = user_data;
        const profile_link = await UsersRepo.get_file_link(user_data.profile_picture_path,"profiles",3600);
        return {...remians,'profile_picture_link': profile_link.signedUrl};

    },
    async gen_name(name:string):Promise<string>{
      const min = 1;
      const max = 10000;
      let check_name = name;

      while (UsersRepo.is_name_exist(check_name)){
        const randomIntInRange = Math.floor(Math.random() * (max - min + 1)) + min;
        check_name = name+randomIntInRange.toString()
      }
      
      return check_name;
    },
    async get_invited(user_id:string):Promise<z.infer<typeof InvitedSchema>>{
      const invited_list = await UsersRepo.get_invited(user_id);
      await invited_list.forEach(async element => {
        if(element.trip_path){
          element.poster_trip_url =( await UsersRepo.get_file_link(element.trip_path,"poster",3600)).signedUrl;
        }
        else{
          element.poster_trip_url = "";
        }
      });
      return invited_list;
    },
  
}

export async function downloadToProfileFile(
  rawUrl: string
): Promise<ProfileFile> {
  const url = rawUrl;

  const resp = await fetch(url, { redirect: "follow" });
  if (!resp.ok) {
    throw new Error(`Download failed: ${resp.status} ${resp.statusText}`);
  }

  const mimetype = resp.headers.get("content-type") || "application/octet-stream";
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);


  const cd = resp.headers.get("content-disposition");
  let filenameFromHeader: string | null = null;
  if (cd) {
    const m = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
    if (m?.[2]) filenameFromHeader = m[2];
  }

  const urlBase = (() => {
    try {
      return path.posix.basename(new URL(url).pathname) || null;
    } catch {
      return null;
    }
  })();

  const ext = mimetype || ".jpg";
  const base =
    filenameFromHeader ??
    urlBase ??
    crypto.randomUUID() + ext;

  const originalname = base.includes(".") ? base : `${base}${ext}`;

  const file: ProfileFile = {
    fieldname: "profile",
    originalname,
    encoding: "7bit",     
    mimetype: mimetype.toLowerCase() as ProfileFile["mimetype"],
    buffer,
    size: buffer.length,
  };
  return file;
}