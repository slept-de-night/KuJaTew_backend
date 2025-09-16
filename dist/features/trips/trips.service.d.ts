export declare const TripsService: {
    get_user_trips(user_id: string): Promise<{
        trip_id: number;
        title: string;
        joined_people: number;
        start_date: Date;
        end_date: Date;
        poster_image_link: string | null;
        planning_status: boolean;
    }[]>;
    get_specific_trip(trip_id: number): Promise<{
        trip_id: number;
        title: string;
        joined_people: number;
        start_date: Date;
        end_date: Date;
        poster_image_link: string | null;
        planning_status: boolean;
    }[]>;
    add_trip(user_id: string, title: string, start_date: Date, end_date: Date, trip_code: string, trip_pass: string, file?: Express.Multer.File): Promise<any>;
    add_owner_collab(trip_id: number, user_id: string): Promise<number | null>;
    delete_trip(user_id: string, trip_id: number): Promise<number | null>;
    edit_trip_detail(owner_id: string, trip_id: number, title?: string, start_date?: Date, end_date?: Date, trip_code?: string, trip_pass?: string, planning_status?: boolean, file?: Express.Multer.File): Promise<any>;
    leave_trip(user_id: string, trip_id: number, collab_id?: number): Promise<number | {
        success: boolean;
    } | null>;
    trip_sum(trip_id: number): Promise<{
        trip_detail: {
            trip_id: number;
            title: string;
            joined_people: number;
            start_date: Date;
            end_date: Date;
            budget: number;
            poster_image_link: string | null;
        }[];
        owner_detail: Omit<{
            name: string;
            phone: string;
            email: string;
            user_id: string;
            profile_picture_path: string | null;
        }, "profile_picture_path"> & {
            profile_picture_link: string;
        };
        members_detail: (Omit<{
            name: string;
            phone: string;
            email: string;
            user_id: string;
            profile_picture_path: string | null;
        }, "profile_picture_path"> & {
            profile_picture_link: string;
        })[];
        flight_detail: {
            flight_id: any;
            depart: {
                dep_date: any;
                dep_time: any;
                dep_country: any;
                dep_airp_code: any;
            };
            arrive: {
                arr_date: any;
                arr_time: any;
                arr_country: any;
                arr_airp_code: any;
            };
            airl_name: any;
        }[];
    }>;
};
//# sourceMappingURL=trips.service.d.ts.map