import { searchRepo } from './search.repo';
import { etcService } from '../../etc/etc.service';
import { BadRequest, INTERNAL } from "../../core/errors";
import { userschema } from './search.schema';
import { env } from "../../config/env";
import { supabase } from "../../config/db";

export const searchService = {
    async search_user(username:string){
        if(!username) throw BadRequest("username is required to search");
        const results = await searchRepo.search_user(username);
        
        const updated = await Promise.all(
          results.map(async (result) => {
            if (!result.profile_picture_link) {
              return result;
            }
            const trip_pic = await etcService.get_file_link(result.profile_picture_link, "profiles", 3600);
            result.profile_picture_link = trip_pic.signedUrl;
            return result;
          })
        );
    
        return updated;
    },

    async search_guide(guide_name:string){
        if(!guide_name) throw BadRequest("guide_name is required to search");
        const results = await searchRepo.search_guide(guide_name);

        const updated = await Promise.all(
          results.map(async (result) => {
            if (result.guide_poster_link) {
              const trip_pic = await etcService.get_file_link(result.guide_poster_link, "posters", 3600);
              result.guide_poster_link = trip_pic.signedUrl;
              return result;
            }
            if (result.owner_image) {
              const owner_pic = await etcService.get_file_link(result.owner_image, "profiles", 3600);
              result.owner_image = owner_pic.signedUrl;
              return result
            }
            return result;
          })
        );
        return updated;
    }
}