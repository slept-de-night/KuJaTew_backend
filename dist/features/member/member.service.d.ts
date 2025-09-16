export declare const MemberService: {
    get_trip_member(user_id: string, trip_id: number): Promise<any[]>;
    edit_role(user_id: string, trip_id: number, collab_id: number, role: string): Promise<any>;
    delete_member(user_id: string, trip_id: number, collab_id: number): Promise<number | null>;
    get_memberid(trip_id: number): Promise<any[]>;
};
//# sourceMappingURL=member.service.d.ts.map