import express from "express"
import { ActivityController, EventController, PlaceController, VoteController } from "./activity.controller"

export const activityRouter = express.Router({ mergeParams:true })

// Activities
activityRouter.get("/:date", ActivityController.list)
activityRouter.delete("/:pit_id", ActivityController.remove)

// Events
activityRouter.post("/events", EventController.create)
activityRouter.patch("/:pit_id/events", EventController.update)

// Places
activityRouter.post("/places", PlaceController.add)
activityRouter.patch("/:pit_id/places", PlaceController.update)

// Voting
activityRouter.get("/:pit_id/votes", VoteController.list)
activityRouter.post("/votes/:type", VoteController.postInit)
activityRouter.post("/:pit_id/votes/:place_id", VoteController.voteByCandidate)
activityRouter.post("/:pit_id/votes/:type/end", VoteController.voteTypeEnd)
activityRouter.post("/:pit_id/voted/:type", VoteController.votedType)
activityRouter.patch("/:pit_id/votes", VoteController.patchVote)
activityRouter.delete("/:pit_id/votes", VoteController.unvote)
activityRouter.delete("/:pit_id/voted", VoteController.deleteVote)
