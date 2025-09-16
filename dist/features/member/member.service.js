"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const member_repo_1 = require("./member.repo");
const errors_1 = require("../../core/errors");
const trips_repo_1 = require("../trips/trips.repo");
exports.MemberService = {
    async get_trip_member(user_id, trip_id) {
        if (!user_id || !trip_id)
            throw (0, errors_1.INTERNAL)("UserID and TripID are required");
        const isin = await member_repo_1.MemberRepo.is_in_trip(user_id, trip_id);
        if (!isin) {
            throw new Error("Only trip member can do this");
        }
        return await member_repo_1.MemberRepo.get_trip_members(trip_id);
    },
    async edit_role(user_id, trip_id, collab_id, role) {
        const isOwner = await trips_repo_1.TripsRepo.check_owner(user_id, trip_id);
        if (!isOwner) {
            throw new Error("Only trip owner can do this");
        }
        return await member_repo_1.MemberRepo.edit_role(role, trip_id, collab_id);
    },
    async delete_member(user_id, trip_id, collab_id) {
        const isOwner = await trips_repo_1.TripsRepo.check_owner(user_id, trip_id);
        if (!isOwner) {
            throw new Error("Only trip owner can do this");
        }
        return await member_repo_1.MemberRepo.delete_member(collab_id, trip_id);
    },
    async get_memberid(trip_id) {
        if (!trip_id)
            throw (0, errors_1.INTERNAL)("UserID and TripID are required");
        const result = await member_repo_1.MemberRepo.get_trip_members(trip_id);
        return result;
    },
};
//# sourceMappingURL=member.service.js.map