import { UsersRepo, User } from "./users.repo";
import { BadRequest, INTERNAL } from "../../core/errors";
import { InvitedSchema, JWT_OBJ, ProfileFile,UsersFullSchema } from "./users.schema";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";
import { gen_jwt_token } from "../../core/jwt,generator";
import z from 'zod';
import { supabase } from "../../config/db";
import path from "node:path";
import { ImageFile } from "../../etc/etc.schema";
import {etcService} from "../../etc/etc.service"
export const UsersService = {
    async create_user(input: User& {"email":string}, profile: ImageFile | null | undefined): Promise<User & { user_id: string,profile_picture_link:string }> {
        
        const created_user = await UsersRepo.create_user(input);
        if (profile) {
            const upload_profile = await etcService.upload_img_storage(profile, created_user.user_id+"_profile","profiles");
            
            await UsersRepo.update_profile_path(upload_profile, created_user.user_id);
            created_user.profile_picture_path = upload_profile;
            const profile_link = await UsersRepo.get_file_link(upload_profile,"profiles",3600);
            return { ...created_user ,profile_picture_link:profile_link.signedUrl};
        }
        return { ...created_user ,profile_picture_link:""}; 
    },
    async google_verify(idToken: string) {
        const googleClient = new OAuth2Client(env.GOOGLE_WEB_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: [env.GOOGLE_WEB_CLIENT_ID], // include all that your app uses
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
        if(user_data.profile_picture_path){
          console.log("ggg")
          const profile_link = await UsersRepo.get_file_link(user_data.profile_picture_path,"profiles",3600);
          return {...remians,'profile_picture_link': profile_link.signedUrl}; 

        }
        else{
          return {...remians,'profile_picture_link': ""};

        }
        
  
    },
    async update_user(input: User ,user_id:string, profile: ImageFile | null | undefined) {
        await UsersRepo.update_user(input,user_id);
        if (profile) {
            const upload_profile = await etcService.upload_img_storage(profile, user_id+"_profile","profiles");
            await UsersRepo.update_profile_path(upload_profile, user_id);
        }
        
    },
    async get_user_details_byemail(email:string):Promise<Omit<z.infer<typeof UsersFullSchema>,'profile_picture_path'> &{'profile_picture_link':string}|null>{
        const user_data = await UsersRepo.get_user_details_byemail(email);
        if (!user_data) return null;
        console.log(user_data)
        const {profile_picture_path,...remians} = user_data;
        const profile_link = await UsersRepo.get_file_link(user_data.profile_picture_path!,"profiles",3600);
        return {...remians,'profile_picture_link': profile_link.signedUrl};

    },
    async gen_name(name:string):Promise<string>{
      const min = 1;
      const max = 10000;
      let check_name = name;

      while (await UsersRepo.is_name_exist(check_name)){
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
    async get_user_detail_krub(user_id:string, trip_id:number){
      if(!user_id || !trip_id) throw BadRequest("UserID and TripID are required");
      const details = await UsersRepo.get_user_detail_krub(user_id, trip_id);
      if (details.user_image){
        const image_link = await UsersRepo.get_file_link(details.user_image,"profiles",3600);
        details.user_image = image_link.signedUrl;
      };
      return details;
    }
}

export async function downloadToProfileFile(
  rawUrl: string
): Promise<ImageFile> {
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

  const file: ImageFile = {
    fieldname: "image",
    originalname,
    encoding: "7bit",     
    mimetype: mimetype.toLowerCase() as ImageFile["mimetype"],
    buffer,
    size: buffer.length,
  };
  return file;
}