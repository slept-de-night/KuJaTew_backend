import { UsersRepo ,User} from "./users.repo";
import {BadRequest} from "../../core/errors";
import { ProfileFile } from "./users.schema";

export const UsersService = {
    async create(input:Omit<User,'profile_pigture_url'>,profile:ProfileFile|null|undefined){
        let upload_profile:any={}
        const created = await UsersRepo.create(input);
        console.log("hello",profile);
        if(profile){
            upload_profile =await UsersRepo.upload_profile(profile,created.user_id);
            await UsersRepo.update_profile_path(upload_profile.path,created.user_id);
        }
        return {"created":{created},"profile":{upload_profile}}
    },
}