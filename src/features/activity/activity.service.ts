import { ActivityRepo, EventRepo, PlaceRepo, VoteRepo } from "./activity.repo"
import { ActivitiesResponse, PlacesVotingResponse, EventVotingResponse } from "./activity.schema"

export const ActivityService = {
  async listAll(trip_id: number) {
    const rows = await ActivityRepo.listAll(trip_id)
    return ActivitiesResponse.parse({ activities: rows })
  },

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
  async list(trip_id: number, pit_id: number) {
    return await VoteRepo.list(trip_id, pit_id)
  },

  init: (trip_id:number, type:"places"|"events" , body:any) =>
    VoteRepo.initVotingBlock(trip_id, type, body),

  voteByCandidate: (
    trip_id: number,
    pit_id: number,
    place_id: number,
    body?: any
  ) => VoteRepo.addCandidate(trip_id, pit_id, place_id, body),


  voteTypeEnd: (trip_id:number, pit_id:number, type:"places"|"events") =>
    type === "places"
      ? VoteRepo.endVotingPlaces(trip_id, pit_id)
      : VoteRepo.endVotingEvents(trip_id, pit_id),


  votedType: (trip_id:number, pit_id:number, type:"places"|"events", user_id:string, body:any) =>
    type === "places"
      ? VoteRepo.votedPlaces(trip_id, pit_id, user_id)
      : VoteRepo.votedEvents(trip_id, pit_id, user_id, body),

  patchVote: (trip_id:number, pit_id:number, patch:any) =>
    VoteRepo.patchVote(trip_id, pit_id, patch),

  unvote: (trip_id:number, pit_id:number) =>
    VoteRepo.removeVotingBlock(trip_id, pit_id),

  async deleteVote(trip_id: number, pit_id: number, user_id: string) {
  return await VoteRepo.deleteVote(trip_id, pit_id, user_id)
}

}
