"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRouter = void 0;
const express_1 = __importDefault(require("express"));
const activity_controller_1 = require("./activity.controller");
exports.activityRouter = express_1.default.Router({ mergeParams: true });
// Activities
exports.activityRouter.get("/AllDate", activity_controller_1.ActivityController.listAll);
exports.activityRouter.get("/:date", activity_controller_1.ActivityController.list);
exports.activityRouter.delete("/:pit_id", activity_controller_1.ActivityController.remove);
// Events
exports.activityRouter.post("/events", activity_controller_1.EventController.create);
exports.activityRouter.patch("/:pit_id/events", activity_controller_1.EventController.update);
// Places
exports.activityRouter.post("/places", activity_controller_1.PlaceController.add);
exports.activityRouter.patch("/:pit_id/places", activity_controller_1.PlaceController.update);
// Voting
exports.activityRouter.get("/:pit_id/votes", activity_controller_1.VoteController.list);
exports.activityRouter.post("/votes/:type", activity_controller_1.VoteController.postInit);
exports.activityRouter.post("/:pit_id/votes/:place_id", activity_controller_1.VoteController.voteByCandidate);
exports.activityRouter.post("/:pit_id/votes/:type/end", activity_controller_1.VoteController.voteTypeEnd);
exports.activityRouter.post("/:pit_id/voted/:type", activity_controller_1.VoteController.votedType);
exports.activityRouter.patch("/:pit_id/votes", activity_controller_1.VoteController.patchVote);
exports.activityRouter.delete("/:pit_id/votes", activity_controller_1.VoteController.unvote);
exports.activityRouter.delete("/:pit_id/voted", activity_controller_1.VoteController.deleteVote);
//# sourceMappingURL=activity.routes.js.map