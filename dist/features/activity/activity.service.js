"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteService = exports.PlaceService = exports.EventService = exports.ActivityService = void 0;
const activity_repo_1 = require("./activity.repo");
const activity_schema_1 = require("./activity.schema");
exports.ActivityService = {
    async listAll(trip_id) {
        const rows = await activity_repo_1.ActivityRepo.listAll(trip_id);
        return activity_schema_1.ActivitiesResponse.parse({ activities: rows });
    },
    async list(trip_id, date) {
        const rows = await activity_repo_1.ActivityRepo.listByDate(trip_id, date);
        return activity_schema_1.ActivitiesResponse.parse({ activities: rows });
    },
    remove: (pit_id) => activity_repo_1.ActivityRepo.remove(pit_id),
};
exports.EventService = {
    create: (trip_id, dto) => activity_repo_1.EventRepo.create(trip_id, dto),
    update: (pit_id, dto) => activity_repo_1.EventRepo.update(pit_id, dto),
};
exports.PlaceService = {
    add: (trip_id, dto) => activity_repo_1.PlaceRepo.add(trip_id, dto),
    update: (pit_id, dto) => activity_repo_1.PlaceRepo.update(pit_id, dto),
};
exports.VoteService = {
    async list(trip_id, pit_id) {
        return await activity_repo_1.VoteRepo.list(trip_id, pit_id);
    },
    init: (trip_id, type, body) => activity_repo_1.VoteRepo.initVotingBlock(trip_id, type, body),
    voteByCandidate: (trip_id, pit_id, place_id, body) => activity_repo_1.VoteRepo.addCandidate(trip_id, pit_id, place_id, body),
    voteTypeEnd: (trip_id, pit_id, type) => type === "places"
        ? activity_repo_1.VoteRepo.endVotingPlaces(trip_id, pit_id)
        : activity_repo_1.VoteRepo.endVotingEvents(trip_id, pit_id),
    votedType: (trip_id, pit_id, type, user_id, body) => type === "places"
        ? activity_repo_1.VoteRepo.votedPlaces(trip_id, pit_id, user_id)
        : activity_repo_1.VoteRepo.votedEvents(trip_id, pit_id, user_id, body),
    patchVote: (trip_id, pit_id, patch) => activity_repo_1.VoteRepo.patchVote(trip_id, pit_id, patch),
    unvote: (trip_id, pit_id) => activity_repo_1.VoteRepo.removeVotingBlock(trip_id, pit_id),
    async deleteVote(trip_id, pit_id, user_id) {
        return await activity_repo_1.VoteRepo.deleteVote(trip_id, pit_id, user_id);
    }
};
//# sourceMappingURL=activity.service.js.map