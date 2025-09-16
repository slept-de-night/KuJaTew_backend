import { z } from "zod";
export declare const ParamsTrip: z.ZodObject<{
    trip_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
}, z.core.$strip>;
export declare const ParamsTripPit: z.ZodObject<{
    trip_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
    pit_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
}, z.core.$strip>;
export declare const GetActivitiesByDateParams: z.ZodObject<{
    trip_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
    date: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export declare const DeleteActivityParams: z.ZodObject<{
    trip_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
    pit_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
}, z.core.$strip>;
export declare const CreateEventBody: z.ZodObject<{
    trip_id: z.ZodNumber;
    place_id: z.ZodLiteral<0>;
    date: z.ZodString;
    time_start: z.ZodString;
    time_end: z.ZodString;
    event_name: z.ZodString;
    is_vote: z.ZodLiteral<false>;
    is_event: z.ZodLiteral<true>;
}, z.core.$strip>;
export declare const UpdateEventBody: z.ZodObject<{
    date: z.ZodString;
    time_start: z.ZodString;
    time_end: z.ZodString;
    event_name: z.ZodString;
}, z.core.$strip>;
export declare const AddPlaceBody: z.ZodObject<{
    place_id: z.ZodNumber;
    date: z.ZodString;
    time_start: z.ZodString;
    time_end: z.ZodString;
    is_vote: z.ZodLiteral<false>;
    event_name: z.ZodLiteral<"">;
    is_event: z.ZodLiteral<false>;
}, z.core.$strip>;
export declare const UpdatePlaceBody: z.ZodObject<{
    date: z.ZodString;
    time_start: z.ZodString;
    time_end: z.ZodString;
}, z.core.$strip>;
export declare const GetVotesParams: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    pit_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const PostVoteTypeParams: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    type: z.ZodEnum<{
        places: "places";
        events: "events";
    }>;
}, z.core.$strip>;
export declare const PostVoteByPlaceParams: z.ZodObject<{
    trip_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
    pit_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
    place_id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
}, z.core.$strip>;
export declare const InitVotingBodyPlaces: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    place_id: z.ZodLiteral<0>;
    date: z.ZodString;
    time_start: z.ZodString;
    time_end: z.ZodString;
    is_vote: z.ZodLiteral<true>;
    is_event: z.ZodLiteral<false>;
}, z.core.$strip>;
export declare const InitVotingBodyEvents: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    place_id: z.ZodCoercedNumber<unknown>;
    date: z.ZodString;
    time_start: z.ZodString;
    time_end: z.ZodString;
    is_vote: z.ZodLiteral<true>;
    is_event: z.ZodLiteral<true>;
}, z.core.$strip>;
export declare const PostVoteByTypeEndParams: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    pit_id: z.ZodCoercedNumber<unknown>;
    type: z.ZodEnum<{
        places: "places";
        events: "events";
    }>;
}, z.core.$strip>;
export declare const PostVotedTypeParams: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    pit_id: z.ZodCoercedNumber<unknown>;
    type: z.ZodEnum<{
        places: "places";
        events: "events";
    }>;
}, z.core.$strip>;
export declare const PostVotedTypeBodyPlaces: z.ZodObject<{
    user_id: z.ZodString;
}, z.core.$strip>;
export declare const PostVotedTypeBodyEvents: z.ZodObject<{
    user_id: z.ZodString;
    event_name: z.ZodString;
}, z.core.$strip>;
export declare const PatchVoteParams: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    pit_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const PatchVoteBody: z.ZodObject<{
    date: z.ZodString;
    start_time: z.ZodString;
    end_time: z.ZodString;
}, z.core.$strip>;
export declare const DeleteVoteParams: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    pit_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const DeleteVoteParamss: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    pit_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const DeleteVoteBody: z.ZodObject<{
    user_id: z.ZodString;
}, z.core.$strip>;
export declare const ActivityItem: z.ZodObject<{
    pit_id: z.ZodNumber;
    place_id: z.ZodNullable<z.ZodNumber>;
    trip_id: z.ZodNumber;
    date: z.ZodDate;
    time_start: z.ZodNullable<z.ZodString>;
    time_end: z.ZodNullable<z.ZodString>;
    address: z.ZodNullable<z.ZodString>;
    is_vote: z.ZodBoolean;
    event_name: z.ZodNullable<z.ZodString>;
    is_event: z.ZodBoolean;
    photo_url: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const ActivitiesResponse: z.ZodObject<{
    activities: z.ZodArray<z.ZodObject<{
        pit_id: z.ZodNumber;
        place_id: z.ZodNullable<z.ZodNumber>;
        trip_id: z.ZodNumber;
        date: z.ZodDate;
        time_start: z.ZodNullable<z.ZodString>;
        time_end: z.ZodNullable<z.ZodString>;
        address: z.ZodNullable<z.ZodString>;
        is_vote: z.ZodBoolean;
        event_name: z.ZodNullable<z.ZodString>;
        is_event: z.ZodBoolean;
        photo_url: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const PlaceVotingItem: z.ZodObject<{
    pit_id: z.ZodNumber;
    place_id: z.ZodNumber;
    address: z.ZodString;
    place_picture_url: z.ZodString;
    voting_count: z.ZodNumber;
    is_voted: z.ZodBoolean;
    is_most_voted: z.ZodBoolean;
}, z.core.$strip>;
export declare const PlacesVotingResponse: z.ZodObject<{
    date: z.ZodDate;
    time_start: z.ZodString;
    time_end: z.ZodString;
    places_voting: z.ZodArray<z.ZodObject<{
        pit_id: z.ZodNumber;
        place_id: z.ZodNumber;
        address: z.ZodString;
        place_picture_url: z.ZodString;
        voting_count: z.ZodNumber;
        is_voted: z.ZodBoolean;
        is_most_voted: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const EventVotingResponse: z.ZodObject<{
    date: z.ZodDate;
    time_start: z.ZodString;
    time_end: z.ZodString;
    event_voting: z.ZodObject<{
        pit_id: z.ZodNumber;
        event_name: z.ZodString;
        voting_count: z.ZodNumber;
        is_voted: z.ZodBoolean;
        is_most_voted: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=activity.schema.d.ts.map