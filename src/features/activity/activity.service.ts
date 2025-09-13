import { ActivityRepo, EventRepo, PlaceRepo, VoteRepo } from "./activity.repo"
import { ActivitiesResponse, PlacesVotingResponse, EventVotingResponse } from "./activity.schema"

export const ActivityService = {
  async list(trip_id:number,date:string){
    const rows = await ActivityRepo.listByDate(trip_id,date)
    return ActivitiesResponse.parse({ activities: rows })
  },
  remove:(pit_id:number)=>ActivityRepo.remove(pit_id),
}

export const EventService = {
  create:(trip_id:number,dto:any)=>EventRepo.create(trip_id,dto),
  update:(pit_id:number,dto:any)=>EventRepo.update(pit_id,dto),
}

export const PlaceService = {
  add:(trip_id:number,dto:any)=>PlaceRepo.add(trip_id,dto),
  update:(pit_id:number,dto:any)=>PlaceRepo.update(pit_id,dto),
}

export const VoteService = {
  async list(trip_id:number, pit_id:number, user_id:string) {
    const row = await VoteRepo.list(trip_id, pit_id, user_id)
    return row ?? null
  },

  init: (trip_id:number, type:"places"|"events", body:any) =>
    VoteRepo.initVotingBlock(trip_id, type, body),

  voteByPlace: (trip_id:number, pit_id:number, place_id:number) =>
    VoteRepo.addPlaceVote(trip_id, pit_id, place_id),

  voteTypeEnd: (trip_id:number, pit_id:number, type:"places"|"events", body:any) =>
    type === "places"
      ? VoteRepo.endVotingPlaces(trip_id, pit_id, body)
      : VoteRepo.endVotingEvents(trip_id, pit_id, body),

  votedType: (trip_id:number, pit_id:number, type:"places"|"events", user_id:string, body:any) =>
    type === "places"
      ? VoteRepo.votedPlaces(trip_id, pit_id, user_id)
      : VoteRepo.votedEvents(trip_id, pit_id, user_id, body),

  patchVote: (trip_id:number, pit_id:number, patch:any) =>
    VoteRepo.patchVote(trip_id, pit_id, patch),

  unvote: (trip_id:number, pit_id:number) =>
    VoteRepo.removeVotingBlock(trip_id, pit_id),
}
