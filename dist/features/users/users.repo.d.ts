import { UserSchema, ProfileFile, UsersFullSchema, InvitedSchema } from './users.schema';
import z from 'zod';
export type User = z.infer<typeof UserSchema>;
export type Profile = {
    id: string;
    path: string;
    fullPath: string;
};
export declare const UsersRepo: {
    create_user(data: User & {
        email: string;
    }): Promise<User & {
        user_id: string;
        email: string;
        profile_picture_path: string | null;
    }>;
    upload_profile(profile: ProfileFile, uuid: string): Promise<Profile>;
    update_profile_path(path: string, user_id: string): Promise<string>;
    get_user_details(user_id: string): Promise<z.infer<typeof UsersFullSchema>>;
    get_user_details_byemail(email: string): Promise<z.infer<typeof UsersFullSchema> | null>;
    get_file_link(path: string, bucket: string, duration: number): Promise<{
        signedUrl: string;
    }>;
    update_user(user_data: User, user_id: string): Promise<void>;
    is_name_exist(name: string): Promise<boolean>;
    get_invited(user_id: string): Promise<z.infer<typeof InvitedSchema>>;
};
//# sourceMappingURL=users.repo.d.ts.map