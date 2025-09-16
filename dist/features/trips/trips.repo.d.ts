export declare const TripsRepo: {
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
    create_trip_base(user_id: string, title: string, start_date: Date, end_date: Date, trip_code: string, trip_pass: string): Promise<any>;
    update_trip_picture(trip_id: number, trip_picture_path: string): Promise<number | null>;
    add_owner_collab(trip_id: number, user_id: string, role: string, accepted: boolean): Promise<number | null>;
    delete_trip(user_id: string, trip_id: number): Promise<number | null>;
    check_owner(owner_id: string, trip_id: number): Promise<number | null>;
    edit_trip_detail(trip_id: number, title?: string, start_date?: Date, end_date?: Date, trip_code?: string, trip_pass?: string, trip_picture_url?: string, planning_status?: boolean): Promise<any>;
    get_trip_pic(trip_id: number): Promise<any>;
    change_owner_in_collab(role: string, collab_id?: number): Promise<number | null>;
    change_owner_in_trips(trip_id: number, member_id: string): Promise<number | null>;
    leave_collab(user_id: string, trip_id: number): Promise<number | null>;
    transferOwner(user_id: string, trip_id: number, collab_id: number): Promise<{
        success: boolean;
    }>;
    trip_sum(trip_id: number): Promise<{
        trip_id: number;
        title: string;
        joined_people: number;
        start_date: Date;
        end_date: Date;
        budget: number;
        poster_image_link: string | null;
    }[]>;
    get_joinedP(trip_id: number): Promise<number>;
};
//# sourceMappingURL=trips.repo.d.ts.map