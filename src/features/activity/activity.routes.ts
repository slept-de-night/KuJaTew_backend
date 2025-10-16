import express from "express"
import { ActivityController, EventController, PlaceController, VoteController } from "./activity.controller"
import { requireRole } from "./activity.service"
import {z} from "zod";

export const activityRouter = express.Router({ mergeParams:true })

function withRole(minRole:"Viewer"|"Editor"|"Owner", handler:any) {
  return async (req:any, res:any, next:any) => {
    try {
      const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
        if(!parsed.success) throw new Error("Missing user");
      let user_id = parsed.data.user_id;
      const { trip_id } = req.params
      await requireRole(Number(trip_id), String(user_id), minRole)
      return handler(req,res,next)
    } catch (err:any) {
      return res.status(403).json({ message: err.message || "Forbidden" })
    }
  }
}

// Activities
activityRouter.get("/AllDate", withRole("Viewer", ActivityController.listAll))
activityRouter.get("/:date", withRole("Viewer", ActivityController.list))
activityRouter.get("/:pit_id", withRole("Viewer", ActivityController.pit_idDetail))
activityRouter.delete("/:pit_id", withRole("Editor", ActivityController.remove))
activityRouter.delete("/clean/:date", withRole("Owner", ActivityController.dateClean))
activityRouter.get("/onlyPlaces/:date", withRole("Viewer", ActivityController.getPlacesByTripDate))

// Events
activityRouter.post("/events", withRole("Editor", EventController.create))
activityRouter.patch("/:pit_id/events", withRole("Editor", EventController.update))

// Places
activityRouter.post("/places", withRole("Editor", PlaceController.add))
activityRouter.patch("/:pit_id/places", withRole("Editor", PlaceController.update))

// Voting
activityRouter.get("/:pit_id/votes", withRole("Viewer", VoteController.list))
activityRouter.post("/votes/:type", withRole("Owner", VoteController.postInit))
activityRouter.post("/:pit_id/votes/:place_id", withRole("Editor", VoteController.addCandidate))
activityRouter.post("/:pit_id/voted/:type", withRole("Viewer", VoteController.votedType))
activityRouter.patch("/:pit_id/votes", withRole("Editor", VoteController.patchVote))
activityRouter.delete("/:pit_id/votes", withRole("Owner", VoteController.cleanVote))
activityRouter.delete("/:pit_id/voted", withRole("Viewer", VoteController.deleteVote))
activityRouter.get("/:pit_id/votes/:type/end", withRole("Viewer", VoteController.getWinners))
activityRouter.get("/:pit_id/voted", withRole("Viewer", VoteController.getUserVoted))
activityRouter.get("/:pit_id/changeVote", withRole("Viewer", VoteController.changeVote))
activityRouter.post("/:pit_id/votes/:type/endOwner", withRole("Owner", VoteController.endOwner))

