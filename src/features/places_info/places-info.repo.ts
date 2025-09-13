
import { map } from 'zod';
import { pool, supabase } from '../../config/db';
import { BadRequest, INTERNAL, POSTGREST_ERR } from '../../core/errors';
import * as schema from './places-info.schema';
export const  PlacesInfoRepo = {
    async places_details(place_id:number):Promise<schema.Places|null>{
        const {data,error} = await supabase.from('places').select("place_id,name,address,lat,lon,categories,overview,rating,rating_count,places_picture_path,api_id,website_url").eq("place_id",place_id);
        console.log(data)
        if (error) throw POSTGREST_ERR(error);
        if(data && data.length >0){
            const parsed = schema.PlaceSchema.safeParse(data[0]);
            if(!parsed.success) throw INTERNAL("Can't Parsed places data");
            return parsed.data;
        }
        else{
            return null;
        }
    },
    async places_details_api(api_id:string):Promise<schema.Places|null>{
        const {data,error} = await supabase.from('places').select("place_id,name,address,lat,lon,categories,overview,rating,rating_count,places_picture_path,api_id,website_url").eq("api_id",api_id);
        console.log(data);
        if (error) throw POSTGREST_ERR(error);
        if(data && data.length >0){
            const parsed = schema.PlaceSchema.safeParse(data[0]);
            if(!parsed.success) throw INTERNAL("Can't Parsed places data");
            return parsed.data;
        }
        else{
            return null;
        }
    },
    async add_places(pdata:Omit<schema.Places,"place_id">):Promise<schema.Places>{

        const {places_picture_url,...remain} = pdata;
        console.log(remain)
        const {data,error} = await supabase.from('places').insert(remain).select("*").single()
        console.log("SHow insert")
        console.log(data)

        
        

        if (error) throw POSTGREST_ERR(error);
        const outdata = schema.PlaceSchema.parse(data);

        return outdata;
    }
}