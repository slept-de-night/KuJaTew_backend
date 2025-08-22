
import { supabase } from '../../config/db';
import { UserSchema, ProfileFile } from './users.schema';
import { POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';
import crypto from 'crypto';
export type User = z.infer<typeof UserSchema>;
export type Profile = {
    id: string;
    path: string;
    fullPath: string;
}


export const UsersRepo = {
    async create(data: Omit<User, 'profile_picture_url'>): Promise<User & { user_id: string }> {
        const udata = { user_id: crypto.randomUUID(), ...data, profile_picture_url: null };
        console.log(udata);
        const { error } = await supabase.from('users').insert(udata);
        if (error) throw POSTGREST_ERR(error);
        return udata;
    },
    async upload_profile(profile: ProfileFile, uuid: string): Promise<Profile> {
        const contentType = profile.mimetype || 'application/octet-stream';
        const filename = uuid + '_profile';
        const { data, error } = await supabase.storage.from('profiles').upload(filename, profile.buffer, {
            contentType,
            cacheControl: '3600',
            upsert: false,
        });
        if (error) throw STORAGE_ERR(error);
        return data;
    },
    async update_profile_path(path:string,user_id:string):Promise<string>{
        const {error} = await supabase.from('users').update({'profile_picture_url':path}).eq('user_id',user_id);
        if(error) throw POSTGREST_ERR(error);
        return path;
    }

}