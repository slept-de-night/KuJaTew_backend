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
  create: async (trip_id:number, dto:any) => {
    const overlaps = await VoteRepo.checkTimeOverlap(
      trip_id, null, dto.date, dto.time_start, dto.time_end
    )
    if (overlaps.length > 0) throw new Error("Time overlap detected")
    return EventRepo.create(trip_id, dto)
  },
  update: async (pit_id:number, dto:any) => {
    const overlaps = await VoteRepo.checkTimeOverlap(
      dto.trip_id, pit_id, dto.date, dto.time_start, dto.time_end
    )
    if (overlaps.length > 0) throw new Error("Time overlap detected")
    return EventRepo.update(pit_id, dto)
  },
}

export const PlaceService = {
  add: async (trip_id:number, dto:any) => {
    const overlaps = await VoteRepo.checkTimeOverlap(
      trip_id, null, dto.date, dto.time_start, dto.time_end
    )
    if (overlaps.length > 0) throw new Error("Time overlap detected")
    return PlaceRepo.add(trip_id, dto)
  },
  update: async (pit_id:number, dto:any) => {
    const overlaps = await VoteRepo.checkTimeOverlap(
      dto.trip_id, pit_id, dto.date, dto.time_start, dto.time_end
    )
    if (overlaps.length > 0) throw new Error("Time overlap detected")
    return PlaceRepo.update(pit_id, dto)
  },
}


export const VoteService = {
  async list(trip_id: number, pit_id: number) {
    return await VoteRepo.list(trip_id, pit_id)
  },

  init: async (trip_id:number, type:"places"|"events", body:any) => {
    const overlaps = await VoteRepo.checkTimeOverlap(
      trip_id, null, body.date, body.time_start, body.time_end
    )
    if (overlaps.length > 0) throw new Error("Time overlap detected")
    return VoteRepo.initVotingBlock(trip_id, type, body)
  },

  voteByCandidate: (
    trip_id: number,
    pit_id: number,
    place_id: number,
    body?: any
  ) => VoteRepo.addCandidate(trip_id, pit_id, place_id, body),


  votedType: (trip_id:number, pit_id:number, type:"places"|"events", user_id:string, body:any) =>
    type === "places"
      ? VoteRepo.votedPlaces(trip_id, pit_id, user_id)
      : VoteRepo.votedEvents(trip_id, pit_id, user_id, body),

  patchVote: async (trip_id:number, pit_id:number, patch:any) => {
    const overlaps = await VoteRepo.checkTimeOverlap(
      trip_id, pit_id, patch.date, patch.start_time, patch.end_time
    )
    if (overlaps.length > 0) {
      throw new Error("Time overlap detected")
    }
    return VoteRepo.patchVote(trip_id, pit_id, patch)
  },

  unvote: (trip_id:number, pit_id:number) =>
    VoteRepo.removeVotingBlock(trip_id, pit_id),

  async deleteVote(trip_id: number, pit_id: number, user_id: string) {
  return await VoteRepo.deleteVote(trip_id, pit_id, user_id)
  },

  getWinners: (trip_id:number, pit_id:number, type:"places"|"events") =>
  type === "places"
    ? VoteRepo.getTopPlaces(trip_id, pit_id)
    : VoteRepo.getTopEvents(trip_id, pit_id),

  checkUserVoted: (trip_id:number, pit_id:number, user_id:string) =>
  VoteRepo.checkUserVoted(trip_id, pit_id, user_id),

  endOwner: (trip_id:number, pit_id:number, type:"places"|"events") =>
  VoteRepo.endOwner(trip_id, pit_id, type),


}
