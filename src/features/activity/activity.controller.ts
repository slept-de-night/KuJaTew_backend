import { ActivityService, EventService, PlaceService, VoteService } from "./activity.service"
import * as S from "./activity.schema"
import z from "zod"


// -------- Activities --------
export const ActivityController = { 
  listAll: async (req:any,res:any,next:any) => {
    try {
      const { trip_id } = S.ParamsTrip.parse(req.params)
      const result = await ActivityService.listAll(trip_id)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },

  list: async (req:any,res:any,next:any) => {
    try {
      const { trip_id, date } = S.GetActivitiesByDateParams.parse(req.params)
      const dateStr = date.toISOString().slice(0,10)
      const result = await ActivityService.list(trip_id, dateStr)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },

  getPlacesByTripDate: async (req: any, res: any) => {
    try {
      const { trip_id, date } = S.GetActivitiesByDateParams.parse(req.params);
      const dateStr = date.toISOString().slice(0,10)
      const result = await ActivityService.getPlacesByTripDate(trip_id, dateStr);
      return res.status(200).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      console.error("[getPlacesByTripDate] error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  remove: async (req:any,res:any,next:any) => {
    try {
      const { pit_id } = S.DeleteActivityParams.parse(req.params)
      await ActivityService.remove(pit_id)
      res.status(204).send()
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },

  dateClean: async (req:any,res:any,next:any) => {
    try {
      const { trip_id , date } = S.GetActivitiesByDateParams.parse(req.params)
      const dateStr = date.toISOString().slice(0,10)
      await ActivityService.dateClean(trip_id , dateStr)
      res.status(204).send()
    } catch (err) {
      if (err instanceof z.ZodError) {
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
        if (err instanceof z.ZodError) {
          return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
        }
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
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
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
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
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
        if (err instanceof z.ZodError) {
          return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
        }
        next(err)
      } 
  },
}

// -------- Voting --------
const getUserId = (req:any) => req.user?.id || req.headers["user_id"]

export const VoteController = {
  list: async (req: any, res: any, next: any) => {
    try {
      const { trip_id, pit_id } = S.GetVotesParams.parse(req.params)
      const result = await VoteService.list(trip_id, pit_id)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },

  postInit: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, type} = S.PostVoteTypeParams.parse(req.params)
      const body = type === "places"
        ? S.InitVotingBodyPlaces.parse(req.body)
        : S.InitVotingBodyEvents.parse(req.body)
      const result = await VoteService.init(+trip_id, type , body)
      res.status(200).json(result)
    } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
        }
        if (err instanceof Error && err.message.includes("Time overlap")) {
          return res.status(400).json({ message: err.message })
        }
        next(err)
      } 
  },

addCandidate: async (req:any,res:any,next:any) => {
    try {
      const { trip_id, pit_id, place_id } = S.PostVoteByPlaceParams.parse(req.params)
      const body = req.body 
      const result = await VoteService.addCandidate(trip_id, pit_id, place_id, body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof z.ZodError) {
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

      const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
        if(!parsed.success) throw new Error("Missing user");
      let user_id = parsed.data.user_id;

      if (!user_id) return res.status(400).json({ message: "Missing user_id" })
      const result = await VoteService.votedType(trip_id, pit_id, type, String(user_id), body)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
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
        if (err instanceof z.ZodError) {
          return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
        }
        if (err instanceof Error && err.message.includes("Time overlap")) {
          return res.status(400).json({ message: err.message })
        }
        next(err)
      } 
  },

  cleanVote: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, pit_id } = S.DeleteVoteParams.parse(req.params)
      await VoteService.cleanVote(trip_id, pit_id)
      res.status(204).send()
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },

  deleteVote: async (req: any, res: any, next: any) => {
  try {
    const { trip_id, pit_id } = S.DeleteVoteParamss.parse(req.params)
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
      if(!parsed.success) throw new Error("Missing user");
    let user_id = parsed.data.user_id;
    if (!user_id) return res.status(400).json({ message: "Missing user_id" })
    const result = await VoteService.deleteVote(trip_id, pit_id, String(user_id))
    res.status(200).json({ success: result })
  } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  }, 

  getWinners: async (req:any, res:any, next:any) => {
  try {
    const { trip_id, pit_id, type } = S.PostVoteByTypeEndParams.parse(req.params)
    const result = await VoteService.getWinners(trip_id, pit_id, type)
    res.status(200).json(result)
  } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      }
      next(err)
    }
  },
  getUserVoted: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, pit_id, } = S.GetUserVotedParams.parse(req.params)
      const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
        if(!parsed.success) throw new Error("Missing user");
      let user_id = parsed.data.user_id;
      if (!user_id) return res.status(400).json({ message: "Missing user_id" })

      const result = await VoteService.checkUserVoted(trip_id, pit_id, String(user_id))
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },
  endOwner: async (req:any, res:any, next:any) => {
    try {
      const { trip_id, pit_id, type } = S.PostVoteEndOwnerParams.parse(req.params)
      const result = await VoteService.endOwner(trip_id, pit_id, type)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" })
      next(err)
    }
  },

}