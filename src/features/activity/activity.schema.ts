import { z } from "zod"

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
const isoTime = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "time must be HH:mm")

export const ParamsTrip = z.object({ trip_id: z.coerce.number().int().positive() })
export const ParamsTripPit = ParamsTrip.extend({ pit_id: z.coerce.number().int().positive() })

// ---------- Activities ----------

export const GetActivitiesByDateParams = ParamsTrip.extend({
  date: z.coerce.date(), 
})

export const DeleteActivityParams = ParamsTripPit

// ---------- Events ----------
export const CreateEventBody = z.object({
  trip_id: z.number().int().positive(),
  place_id: z.literal(0),
  date: isoDate,
  time_start: isoTime,
  time_end: isoTime,
  event_name: z.string().min(1),
  is_vote: z.literal(false),
  is_event: z.literal(true),
})

export const UpdateEventBody = z.object({
  date: isoDate,
  time_start: isoTime,
  time_end: isoTime,
  event_name: z.string().min(1),
})

// ---------- Places ----------
export const AddPlaceBody = z.object({
  place_id: z.number().int().positive(),
  date: isoDate,
  time_start: isoTime,
  time_end: isoTime,
  is_vote: z.literal(false),
  event_name: z.literal(""),
  is_event: z.literal(false),
})

export const UpdatePlaceBody = z.object({
  date: isoDate,
  time_start: isoTime,
  time_end: isoTime,
})

// ---------- Voting ----------
export const GetVotesParams = ParamsTripPit
export const PostVoteTypeParams = ParamsTrip.extend({ type: z.enum(["places","events"]) })

export const InitVotingBodyPlaces = z.object({
  place_id: z.number().int().positive(),
  trip_id: z.number().int().positive(),
  date: isoDate,
  time_start: isoTime,
  time_end: isoTime,
  is_vote: z.literal(true),
  is_event: z.literal(false),
})

export const InitVotingBodyEvents = z.object({
  place_id: z.literal(0),
  trip_id: z.number().int().positive(),
  date: isoDate,
  time_start: isoTime,
  time_end: isoTime,
  is_vote: z.literal(true),
  is_event: z.literal(true),
})

export const PostVoteByPlaceParams = ParamsTripPit.extend({ place_id: z.number().int().positive() })

export const PostVoteByTypeEndParams = ParamsTripPit.extend({ type: z.enum(["places","events"]) })
export const PostVoteByTypeEndBodyPlaces = z.object({ pit_id: z.number().int().positive() })
export const PostVoteByTypeEndBodyEvents = z.object({ event_name: z.string().min(1) })

export const PostVotedTypeParams = ParamsTripPit.extend({ type: z.enum(["places","events"]) })
export const PostVotedTypeBodyEvents = z.object({ event_name: z.string().min(1) })
export const PostVotedTypeBodyPlaces = z.object({})

export const PatchVoteParams = ParamsTripPit
export const PatchVoteBody = z.object({
  date: isoDate,
  start_time: isoTime,
  end_time: isoTime,
})

export const DeleteVoteParams = ParamsTripPit

// ---------- Response Schemas ----------
export const ActivityItem = z.object({
  pit_id: z.number(),
  place_id: z.number().nullable(),
  trip_id: z.number(),
  date: z.date(),
  time_start: z.string().nullable(),
  time_end: z.string().nullable(),
  address: z.string().nullable(),
  is_vote: z.boolean(),
  event_name: z.string().nullable(),
  is_event: z.boolean(),
  photo_url: z.string().nullable(),
})
export const ActivitiesResponse = z.object({ activities: z.array(ActivityItem) })

export const PlaceVotingItem = z.object({
  pit_id: z.number(),
  place_id: z.number(),
  address: z.string(),
  place_picture_url: z.string(),
  voting_count: z.number(),
  is_voted: z.boolean(),
  is_most_voted: z.boolean(),
})

export const PlacesVotingResponse = z.object({
  date: z.date(),
  time_start: z.string(),
  time_end: z.string(),
  places_voting: z.array(PlaceVotingItem),
})

export const EventVotingResponse = z.object({
  date: z.date(),
  time_start: z.string(),
  time_end: z.string(),
  event_voting: z.object({
    pit_id: z.number(),
    event_name: z.string(),
    voting_count: z.number(),
    is_voted: z.boolean(),
    is_most_voted: z.string(),
  }),
})
