import { Request, Response } from 'express';
import { downloadToProfileFile, UsersService } from './users.service';
import { UserSchema,ProfileFileSchema, ProfileNullableSchema, GoogleAuthSchema, IdTokenSchema } from './users.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import axios from 'axios';
import z from 'zod';
import { parentPort } from 'node:worker_threads';
import { ImageFileSchema } from '../../etc/etc.schema';

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
 
  const body_parsed = UserSchema.safeParse(req.body);
  if(!body_parsed.success) throw BadRequest("Request Structure is not invalide!")
  
  const file_parsed = ImageFileSchema.safeParse(req.file) ;
  if(!file_parsed.success) throw BadRequest("Request File is not invalide!")
  
  await UsersService.update_user({...body_parsed.data},(req as any).user.user_id,file_parsed.data ??null);
  res.status(200).json({mes:"updated user success!"});
});


export const Users_Details= asyncHandler(async (req: Request, res: Response) => {
 
  const parsed = z.string().safeParse((req.params.user_id));
  if(!parsed.success) throw BadRequest("Invalide Request");
  
  const user_data = await UsersService.get_user_details(parsed.data);
 
  res.status(201).json(user_data);
});
export const Users_Details_self= asyncHandler(async (req: Request, res: Response) => {
  
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  
  const user_data = await UsersService.get_user_details(parsed.data.user_id);
 
  
  res.status(201).json(user_data);
});


export const getTokenRefresh= asyncHandler(async (req: Request, res: Response) => {
  
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  const token = await UsersService.gen_jwt(parsed.data.user_id);
  res.status(200).json(token);
});

export const getinviteds= asyncHandler(async (req: Request, res: Response) => {
  
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  
  const invited_list = await UsersService.get_invited(parsed.data.user_id);
  res.status(200).json({invited:invited_list});
});
export const loginUser = asyncHandler(async (req: Request, res: Response) => {

  const body_parsed =IdTokenSchema.safeParse(req.body);
  if(!body_parsed.success) throw BadRequest("Request Structure is not invalide!") 
  
  //console.log(body_parsed.data.idToken);

  const  payload = await UsersService.google_verify(body_parsed.data.idToken);
  const parsed_payload = GoogleAuthSchema.safeParse(payload);
  if(!parsed_payload.success) throw INTERNAL("Payload Can not parsed");

  const old_data = await UsersService.get_user_details_byemail(parsed_payload.data.email);
  if(old_data!=null){
    console.log("Account exist.")
    const token = await UsersService.gen_jwt(old_data.user_id);
    res.status(200).json({...old_data,...token});
  }
  else {
    console.log("Try to create new account")
    const profile = await downloadToProfileFile(parsed_payload.data.picture);
    //console.log(profile)

    let profile_parsed = ImageFileSchema.safeParse(profile) ;
    if(!profile_parsed.success) {
      console.log("Fail to retrive profile picture");
      const dummy_profile = await downloadToProfileFile("https://macromissionary.com/wp-content/uploads/2021/10/dummy-avatar-2.jpg");
      profile_parsed = ImageFileSchema.safeParse(dummy_profile);
    }
    console.log(profile_parsed.data);
    const unique_name = await UsersService.gen_name(parsed_payload.data.name);
   
    const user = await UsersService.create_user({email:parsed_payload.data.email,phone:"",
      name:unique_name},profile_parsed.data ?? null);
    
    const token = await UsersService.gen_jwt(user.user_id);
    console.log("  Login success !!!")
    res.status(201).json({...user,...token});
  }
});

export const getmoredetail= asyncHandler(async (req: Request, res: Response) => {
  const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
  if(!parsed.success) throw BadRequest("Invalide Request");
  
  const parsedparams = z.object({trip_id:z.coerce.number()}).safeParse(req.params);
  if(!parsedparams.success) throw BadRequest("Invalide Request");

  const user_details = await UsersService.get_user_detail_krub(parsed.data.user_id, parsedparams.data.trip_id);
  res.status(200).json(user_details);
});