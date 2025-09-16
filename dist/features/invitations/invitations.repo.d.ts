export declare function invite(inviter_user_id: string, trip_id: number, invited_user_name: string): Promise<boolean>;
export declare function code_join(user_id: string, trip_code: string, trip_password: string): Promise<boolean>;
export declare function accept_invite(trip_id: number, user_id: string): Promise<boolean>;
export declare function reject_invite(trip_id: number, user_id: string): Promise<boolean>;
//# sourceMappingURL=invitations.repo.d.ts.map