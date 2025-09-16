export declare const ActivityService: {
    listAll(trip_id: number): Promise<{
        activities: {
            pit_id: number;
            place_id: number | null;
            trip_id: number;
            date: Date;
            time_start: string | null;
            time_end: string | null;
            address: string | null;
            is_vote: boolean;
            event_name: string | null;
            is_event: boolean;
            photo_url: string | null;
        }[];
    }>;
    list(trip_id: number, date: string): Promise<{
        activities: {
            pit_id: number;
            place_id: number | null;
            trip_id: number;
            date: Date;
            time_start: string | null;
            time_end: string | null;
            address: string | null;
            is_vote: boolean;
            event_name: string | null;
            is_event: boolean;
            photo_url: string | null;
        }[];
    }>;
    remove: (pit_id: number) => Promise<boolean>;
};
export declare const EventService: {
    create: (trip_id: number, dto: any) => Promise<import("pg").QueryResultRow | undefined>;
    update: (pit_id: number, dto: any) => Promise<import("pg").QueryResultRow | undefined>;
};
export declare const PlaceService: {
    add: (trip_id: number, dto: any) => Promise<import("pg").QueryResultRow | undefined>;
    update: (pit_id: number, dto: any) => Promise<import("pg").QueryResultRow | undefined>;
};
export declare const VoteService: {
    list(trip_id: number, pit_id: number): Promise<{
        date: string;
        time_start: string;
        time_end: string;
        places_voting: {
            pit_id: any;
            place_id: any;
            address: any;
            place_picture_url: string | null;
            voting_count: number;
            is_most_voted: boolean;
        }[];
        event_voting?: never;
    } | {
        date: string;
        time_start: string;
        time_end: string;
        event_voting: {
            is_most_voted: any;
            pit_id?: any;
            event_name?: any;
            voting_count?: number;
        };
        places_voting?: never;
    }>;
    init: (trip_id: number, type: "places" | "events", body: any) => Promise<import("pg").QueryResultRow | undefined>;
    voteByCandidate: (trip_id: number, pit_id: number, place_id: number, body?: any) => Promise<import("pg").QueryResultRow | undefined>;
    voteTypeEnd: (trip_id: number, pit_id: number, type: "places" | "events") => Promise<import("pg").QueryResultRow | null>;
    votedType: (trip_id: number, pit_id: number, type: "places" | "events", user_id: string, body: any) => Promise<boolean>;
    patchVote: (trip_id: number, pit_id: number, patch: any) => Promise<import("pg").QueryResultRow | undefined>;
    unvote: (trip_id: number, pit_id: number) => Promise<boolean>;
    deleteVote(trip_id: number, pit_id: number, user_id: string): Promise<boolean>;
};
//# sourceMappingURL=activity.service.d.ts.map