import { Request, Response } from 'express';
import { downloadToProfileFile, UsersService } from './users.service';
import { UserSchema,ProfileFileSchema, ProfileNullableSchema, GoogleAuthSchema, IdTokenSchema } from './users.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import axios from 'axios';
import z from 'zod';
import { parentPort } from 'node:worker_threads';

export const updateUser = asyncHandler(async (req: Request, res: Response) => {

  let upload_profile = {}; 
  const body_parsed = UserSchema.safeParse(req.body);
  if(!body_parsed.success) throw BadRequest("Request Structure is not invalide!")

  if(!req.file)console.log("Profile File not exist");
  
  const file_parsed = ProfileFileSchema.safeParse(req.file) ;
  if(!file_parsed.success) throw BadRequest("Request File is not invalide!")
 
  await UsersService.update_user({...body_parsed.data},(req as any).user.user_id,file_parsed.data ??null);
  res.status(200).json({mes:"updated user success!"});
});


export const getUsersDetails = asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  const user_data = UsersService.get_user_details(parsed.data.user_id);

  res.status(201).json(user_data);
});

export const getTokenRefresh= asyncHandler(async (req: Request, res: Response) => {
  console.log("hello")
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  const token = await UsersService.gen_jwt(parsed.data.user_id);
  res.status(200).json(token);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {

  
  const body_parsed =IdTokenSchema.safeParse(req.body);
  if(!body_parsed.success) throw BadRequest("Request Structure is not invalide!") 
  
  console.log(body_parsed.data.idToken);

  const  payload = await UsersService.google_verify(body_parsed.data.idToken);
  const parsed_payload = GoogleAuthSchema.safeParse(payload);
  if(!parsed_payload.success) throw INTERNAL("Payload Can not parsed");

  const old_data = await UsersService.get_user_details_byemail(parsed_payload.data.email);
  if(old_data!=null){
    const token = await UsersService.gen_jwt(old_data.user_id);
    res.status(200).json({...old_data,...token});
  }
  else {
    const profile = await downloadToProfileFile(parsed_payload.data.picture);
    console.log(profile)

    const profile_parsed = ProfileFileSchema.safeParse(profile) ;
    if(!profile_parsed.success) console.log("Fail to retrive profile picture");
    console.log(profile_parsed.data);
    
    const user = await UsersService.create_user({email:parsed_payload.data.email,phone:"",name:parsed_payload.data.name},profile_parsed.data ?? null);
    const token = await UsersService.gen_jwt(user.user_id);
    res.status(201).json({...user,...token});
  }

});
