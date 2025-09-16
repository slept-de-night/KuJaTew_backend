export declare const ActivityRepo: {
    listAll(trip_id: number): Promise<any[]>;
    listByDate(trip_id: number, date: string): Promise<any[]>;
    remove(pit_id: number): Promise<boolean>;
};
export declare const EventRepo: {
    create(trip_id: number, dto: any): Promise<import("pg").QueryResultRow | undefined>;
    update(pit_id: number, dto: any): Promise<import("pg").QueryResultRow | undefined>;
};
export declare const PlaceRepo: {
    add(trip_id: number, dto: any): Promise<import("pg").QueryResultRow | undefined>;
    update(pit_id: number, dto: any): Promise<import("pg").QueryResultRow | undefined>;
};
export declare const VoteRepo: {
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
    initVotingBlock(trip_id: number, type: "places" | "events", body: any): Promise<import("pg").QueryResultRow | undefined>;
    addCandidate(trip_id: number, pit_id: number, place_id: number, body?: {
        event_name?: string;
    }): Promise<import("pg").QueryResultRow | undefined>;
    votedPlaces(trip_id: number, pit_id: number, user_id: string): Promise<boolean>;
    votedEvents(trip_id: number, pit_id: number, user_id: string, body: any): Promise<boolean>;
    endVotingPlaces(trip_id: number, pit_id: number): Promise<import("pg").QueryResultRow | null>;
    endVotingEvents(trip_id: number, pit_id: number): Promise<import("pg").QueryResultRow | null>;
    patchVote(trip_id: number, pit_id: number, patch: any): Promise<import("pg").QueryResultRow | undefined>;
    removeVotingBlock(trip_id: number, pit_id: number): Promise<boolean>;
    deleteVote(trip_id: number, pit_id: number, user_id: string): Promise<boolean>;
};
//# sourceMappingURL=activity.repo.d.ts.map