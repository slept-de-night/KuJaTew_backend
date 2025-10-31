
import { pool, supabase } from '../../config/db';
import { UserSchema, ProfileFile, UsersFullSchema,InvitedSchema, more_detail } from './users.schema';
import { INTERNAL, POSTGREST_ERR, STORAGE_ERR } from '../../core/errors';
import z from 'zod';
import crypto from 'crypto';
export type User = z.infer<typeof UserSchema>;
export type Profile = {
    id: string;
    path: string;
    fullPath: string;
}

export const UsersRepo = {
    async create_user(data: User &{email:string}): Promise<User &{user_id:string,email:string,profile_picture_path:string|null}> {
        const user_data = { user_id: crypto.randomUUID(), ...data,profile_picture_path:null };
        console.log(user_data)
        const { error } = await supabase.from('users').insert(user_data);
        console.log(error)
        if (error) throw POSTGREST_ERR(error);
        
        return user_data;
    },

    async update_profile_path(path:string,user_id:string):Promise<string>{
        
        const {error} = await supabase.from('users').update({'profile_picture_path':path}).eq('user_id',user_id);
        if(error) throw POSTGREST_ERR(error);
        return path;
    },
    async delete_profile(user_id:string){
        const {data,error} = await supabase.from('users').select('profile_picture_path').eq('user_id',user_id);
        if(error) throw POSTGREST_ERR(error);
        if(data.length>0){
            const {error} = await supabase.storage.from('profiles').remove(data[0]?.profile_picture_path);
            if(error) throw STORAGE_ERR(error);
        }
    },
    async get_user_details(user_id:string):Promise<z.infer<typeof UsersFullSchema>>{

        const {data,error} = await supabase.from('users').select("*").eq("user_id",user_id);
        if (error) throw POSTGREST_ERR(error);

        if (data.length != 1){console.log("user id have exist same value")}

        const parsed = UsersFullSchema.safeParse(data[0]);
        if(!parsed.success) throw INTERNAL("Can't Parsed data");

        return parsed.data;
    },
    async get_user_details_byemail(email:string):Promise<z.infer<typeof UsersFullSchema>|null>{
        console.log(email)

        const {data,error} = await supabase.from('users').select("*").eq("email",email);
        if (error) throw POSTGREST_ERR(error);
        console.log(data[0])
        const parsed = UsersFullSchema.safeParse(data[0]);
        //console.log(parsed.data);
        if(!parsed.success) return null;
        return parsed.data;
    },
    async get_file_link(path:string,bucket:string,duration:number):Promise<{signedUrl:string}>{
        const {data,error} = await supabase.storage.from(bucket).createSignedUrl(path,duration);
        if (error) throw STORAGE_ERR(error);
        return data;
    },
    async update_user(user_data: User,user_id:string ){
        //console.log(user_data);

        const { error } = await supabase.from('users').update({"name":user_data.name,"phone":user_data.phone}).eq('user_id',user_id);
        if (error) throw POSTGREST_ERR(error);
      
    },
    async is_name_exist(name:string):Promise<boolean>{
        const {data , error} = await supabase.from('users').select('name').eq('name',name);
        if(error) throw POSTGREST_ERR(error);
        if (data.length>0){
            return true;
        }
        return false;
    },
    async get_invited(user_id:string):Promise<z.infer<typeof InvitedSchema>>{
        const query = "WITH invited_trip AS (SELECT a.trip_id FROM trip_collaborators a WHERE a.user_id = $1 AND a.accepted = False)\
            SELECT b.trip_id,b.title as trip_name,b.start_date,b.end_date,c.name AS trip_owner,b.trip_picture_path AS trip_path FROM invited_trip a JOIN trips b \
            ON a.trip_id = b.trip_id JOIN users c ON b.user_id = c.user_id";
        
        const result = await pool.query(query,[user_id]);
        const data = InvitedSchema.safeParse(result.rows);
        
        if(!data.success) throw INTERNAL("Fail to parsed data");
        return data.data;
    },
    // keen adding something good na

    async get_user_detail_krub(user_id:string, trip_id:number){
        const query = `
            SELECT 
                tc.collab_id as collab_id,
                tc.user_id as user_id,
                u.name as username,
                tc.role as role,
                u.profile_picture_path as user_image,
                t.trip_code as trip_code
            FROM trip_collaborators tc
            JOIN users u ON tc.user_id = u.user_id
            JOIN trips t ON t.trip_id = tc.trip_id
            WHERE tc.user_id = $1 AND tc.trip_id = $2
        `
        const {rows} = await pool.query(query, [user_id, trip_id]);
        const parsed = more_detail.safeParse(rows[0]);
        if(!parsed.success) throw INTERNAL("Fail to parsed query");
        return parsed.data;
    },
}
