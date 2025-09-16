export declare function get_place(userId: string): Promise<import("pg").QueryResultRow[]>;
export declare function add_place(userId: string, placeId: number): Promise<boolean>;
export declare function remove_place(userId: string, placeId: number): Promise<boolean>;
export declare function get_guide(userId: string): Promise<import("pg").QueryResultRow[]>;
export declare function add_guide(userId: string, trip_id: number): Promise<boolean>;
export declare function remove_guide(userId: string, gbookmark_id: number): Promise<boolean>;
//# sourceMappingURL=bookmarks.service.d.ts.map