import { UsersRepo ,User} from "./users.repo";
import {BadRequest} from "../../core/errors";
import { ProfileFile } from "./users.schema";
export const UsersService = {
    async create(input:Omit<User,'profile_pigture_url'>){
        return UsersRepo.create(input);
    },
    async upload_profile(profile:ProfileFile,filename:string){
        return UsersRepo.upload_profile(profile,filename);
    }

}