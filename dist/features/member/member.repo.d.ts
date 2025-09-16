export declare const MemberRepo: {
    get_trip_members(trip_id: number): Promise<any[]>;
    is_in_trip(user_id: string, trip_id: number): Promise<number | null>;
    edit_role(role: string, trip_id: number, collab_id: number): Promise<any>;
    delete_member(collab_id: number, trip_id: number): Promise<number | null>;
    get_memberid(trip_id: number): Promise<{
        user_id: string;
        role: string;
    }[]>;
};
//# sourceMappingURL=member.repo.d.ts.map