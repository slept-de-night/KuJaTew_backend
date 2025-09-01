import { User } from "./users.repo";
import { JWT_OBJ, ProfileFile, UsersFullSchema } from "./users.schema";
import z from 'zod';
export declare const UsersService: {
    create_user(input: User & {
        "email": string;
    }, profile: ProfileFile | null | undefined): Promise<User & {
        user_id: string;
        profile_picture_link: string;
    }>;
    google_verify(idToken: string): Promise<import("google-auth-library").TokenPayload>;
    gen_jwt(user_id: string): Promise<JWT_OBJ>;
    get_user_details(user_id: string): Promise<Omit<z.infer<typeof UsersFullSchema>, "profile_picture_path"> & {
        "profile_picture_link": string;
    }>;
    update_user(input: User, user_id: string, profile: ProfileFile | null | undefined): Promise<void>;
};
//# sourceMappingURL=users.service.d.ts.map