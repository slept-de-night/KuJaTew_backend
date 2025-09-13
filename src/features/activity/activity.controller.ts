import { ActivityService, EventService, PlaceService, VoteService } from "./activity.service"
import * as S from "./activity.schema"
import { ZodError } from "zod"

// -------- Activities --------
export const ActivityController = { 
  list: async (req:any,res:any,next:any) => {
    try {
      const { trip_id, date } = S.GetActivitiesByDateParams.parse(req.params)
      const dateStr = date.toISOString().slice(0,10)
      const result = await ActivityService.list(trip_id, dateStr)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },

  remove: async (req:any,res:any,next:any) => {
    try {
      const { pit_id } = S.DeleteActivityParams.parse(req.params)
      await ActivityService.remove(pit_id)
      res.status(204).send()
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },
}


// -------- Events --------
export const EventController = {
  create: async (req:any,res:any,next:any) => {
    try {
      const { trip_id } = req.params
      const body = S.CreateEventBody.parse(req.body)
      if (body.trip_id !== Number(trip_id)) {
        return res.status(400).json({ message: "trip_id mismatch" })
      }
      const result = await EventService.create(+trip_id, body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },

  update: async (req:any,res:any,next:any) => {
    try {
      const { pit_id } = req.params
      const body = S.UpdateEventBody.parse(req.body)
      const result = await EventService.update(+pit_id, body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },
}

// -------- Places --------
export const PlaceController = {
  add: async (req:any,res:any,next:any) => {
    try {
      const { trip_id } = req.params
      const body = S.AddPlaceBody.parse(req.body)
      const result = await PlaceService.add(+trip_id, body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },
  
  update: async (req:any,res:any,next:any) => {
    try {
      const { pit_id } = req.params
      const body = S.UpdatePlaceBody.parse(req.body)
      const result = await PlaceService.update(+pit_id, body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },
}

// -------- Voting --------
const getUserId = (req:any) => req.user?.id || req.headers["x-user-id"]

export const VoteController = {
  list: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, pit_id } = S.GetVotesParams.parse(req.params)
      const user_id = getUserId(req)
      const result = await VoteService.list(trip_id, pit_id, user_id as string)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },

  postInit: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, type } = S.PostVoteTypeParams.parse(req.params)
      const body = type === "places"
        ? S.InitVotingBodyPlaces.parse(req.body)
        : S.InitVotingBodyEvents.parse(req.body)
      const result = await VoteService.init(+trip_id, type, body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },

voteByCandidate: async (req:any, res:any, next:any) => {
  try {
    console.log("====== voteByCandidate called ======")
    console.log("req.params:", req.params)
    console.log("req.body:", req.body)

    // test parse ทีละอัน
    console.log("trip_id raw:", req.params.trip_id)
    console.log("pit_id raw:", req.params.pit_id)
    console.log("place_id raw:", req.params.place_id)

    const parsed = S.PostVoteByPlaceParams.safeParse(req.params)
    if (!parsed.success) {
      console.error("ZodError detail:", parsed.error.format())
      return res.status(400).json({ message: "Params validation failed", issues: parsed.error.issues })
    }

    console.log("parsed params:", parsed.data)

    const result = await VoteService.voteByCandidate(
      parsed.data.trip_id,
      parsed.data.pit_id,
      parsed.data.place_id,
      req.body
    )
    res.status(200).json(result)
  } catch (err) {
    console.error("voteByCandidate catch:", err)
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
    }
    next(err)
  }
},



  voteTypeEnd: async (req: any, res: any, next: any) => {
    try {
      const { trip_id, pit_id, type } = S.PostVoteByTypeEndParams.parse(req.params)
      // ไม่ต้อง parse body/ไม่ต้องส่ง body ให้ service แล้ว
      const result = await VoteService.voteTypeEnd(trip_id, pit_id, type)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },

  votedType: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, pit_id, type } = S.PostVotedTypeParams.parse(req.params)
      const body = type === "places"
        ? S.PostVotedTypeBodyPlaces.parse(req.body)
        : S.PostVotedTypeBodyEvents.parse(req.body)
      const user_id = getUserId(req)
      const result = await VoteService.votedType(trip_id, pit_id, type, user_id as string, body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },

  patchVote: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, pit_id } = S.PatchVoteParams.parse(req.params)
      const patch = S.PatchVoteBody.parse(req.body)
      const result = await VoteService.patchVote(trip_id, pit_id, patch)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },

  unvote: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, pit_id } = S.DeleteVoteParams.parse(req.params)
      await VoteService.unvote(trip_id, pit_id)
      res.status(204).send()
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },
}