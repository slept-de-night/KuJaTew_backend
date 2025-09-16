"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const trips_repo_1 = require("./trips.repo");
const errors_1 = require("../../core/errors");
const db_1 = require("../../config/db");
const users_repo_1 = require("../users/users.repo");
const member_repo_1 = require("../member/member.repo");
const users_service_1 = require("../users/users.service");
const Flightservice = __importStar(require("../flights/flights.service"));
exports.TripsService = {
    async get_user_trips(user_id) {
        if (!user_id)
            throw (0, errors_1.INTERNAL)("User ID is required");
        const trips = await trips_repo_1.TripsRepo.get_user_trips(user_id);
        const updatedTrips = await Promise.all(trips.map(async (trip) => {
            if (!trip.poster_image_link) {
                return trip;
            }
            const trip_pic = await users_repo_1.UsersRepo.get_file_link(trip.poster_image_link, "posters", 3600);
            trip.poster_image_link = trip_pic.signedUrl;
            return trip;
        }));
        return updatedTrips;
    },
    async get_specific_trip(trip_id) {
        if (!trip_id)
            throw (0, errors_1.INTERNAL)("Trip ID is required");
        const trips = await trips_repo_1.TripsRepo.get_specific_trip(trip_id);
        const updatedTrips = await Promise.all(trips.map(async (trip) => {
            if (!trip.poster_image_link) {
                return trip;
            }
            const trip_pic = await users_repo_1.UsersRepo.get_file_link(trip.poster_image_link, "posters", 3600);
            trip.poster_image_link = trip_pic.signedUrl;
            return trip;
        }));
        return updatedTrips;
    },
    async add_trip(user_id, title, start_date, end_date, trip_code, trip_pass, file) {
        const trip = await trips_repo_1.TripsRepo.create_trip_base(user_id, title, start_date, end_date, trip_code, trip_pass);
        let picturePath = null;
        if (file) {
            const fileName = `${trip.trip_id}-${file.originalname}`;
            const { error } = await db_1.supabase.storage
                .from("posters")
                .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });
            if (error)
                throw new Error(error.message);
            picturePath = fileName;
            await trips_repo_1.TripsRepo.update_trip_picture(trip.trip_id, picturePath);
        }
        await trips_repo_1.TripsRepo.add_owner_collab(trip.trip_id, user_id, "Owner", true);
        return { ...trip, poster_image_link: picturePath };
    },
    async add_owner_collab(trip_id, user_id) {
        if (!trip_id || !user_id)
            throw (0, errors_1.INTERNAL)("User ID AND Trip ID are required");
        const trips = await trips_repo_1.TripsRepo.add_owner_collab(trip_id, user_id, "Owner", true);
        return trips;
    },
    async delete_trip(user_id, trip_id) {
        if (!user_id || !trip_id)
            throw (0, errors_1.INTERNAL)("User ID AND Trip ID are required");
        const isOwner = await trips_repo_1.TripsRepo.check_owner(user_id, trip_id);
        if (!isOwner)
            throw new Error("Only trip owner can delete trip");
        const trips = await trips_repo_1.TripsRepo.delete_trip(user_id, trip_id);
        return trips;
    },
    async edit_trip_detail(owner_id, trip_id, title, start_date, end_date, trip_code, trip_pass, planning_status, file) {
        if (!owner_id || !trip_id)
            throw (0, errors_1.INTERNAL)("OwnerID and TripID are required");
        const isOwner = await trips_repo_1.TripsRepo.check_owner(owner_id, trip_id);
        if (!isOwner) {
            throw new Error("Only Owner can edit trip detail");
        }
        const get_pic_path = await trips_repo_1.TripsRepo.get_trip_pic(trip_id);
        const old_pic_path = get_pic_path?.trip_picture_path ?? null;
        let trip_picture_path = old_pic_path;
        if (file) {
            const fileName = `${trip_id}-${file.originalname}`;
            const { error } = await db_1.supabase.storage
                .from("posters")
                .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
            if (error)
                throw error;
            trip_picture_path = fileName;
            if (old_pic_path) {
                const { error } = await db_1.supabase.storage.from("posters").remove([old_pic_path]);
                if (error) {
                    console.error("Failed to delete:", error.message);
                }
            }
        }
        return await trips_repo_1.TripsRepo.edit_trip_detail(trip_id, title, start_date, end_date, trip_code, trip_pass, trip_picture_path, planning_status);
    },
    async leave_trip(user_id, trip_id, collab_id) {
        const isOwner = await trips_repo_1.TripsRepo.check_owner(user_id, trip_id);
        const joinedP = await trips_repo_1.TripsRepo.get_joinedP(trip_id);
        if (!isOwner) { // not an owner
            const result = await trips_repo_1.TripsRepo.leave_collab(user_id, trip_id);
            return result;
        }
        if (isOwner && (joinedP == 1)) { // leave and delete trip
            const result = await trips_repo_1.TripsRepo.delete_trip(user_id, trip_id);
            return result;
        }
        if (!collab_id) {
            throw new Error("collab_id required when owner leaves with other members");
        }
        else {
            const result = await trips_repo_1.TripsRepo.transferOwner(user_id, trip_id, collab_id);
            return result;
        }
    },
    async trip_sum(trip_id) {
        if (!trip_id)
            throw (0, errors_1.INTERNAL)("Trip ID is required");
        const trips = await trips_repo_1.TripsRepo.trip_sum(trip_id);
        // get trip file link
        const trip_detail = await Promise.all(trips.map(async (trip) => {
            if (!trip.poster_image_link)
                return trip;
            const trip_pic = await users_repo_1.UsersRepo.get_file_link(trip.poster_image_link, "posters", 3600);
            trip.poster_image_link = trip_pic.signedUrl;
            return trip;
        }));
        // get owner & members detail
        const all_members = await member_repo_1.MemberRepo.get_memberid(trip_id);
        const owner = all_members.find(m => m.role === "Owner");
        const members = all_members.filter(m => m.role !== "Owner");
        const owner_detail = await users_service_1.UsersService.get_user_details(owner?.user_id);
        const members_detail = await Promise.all(members.map(async (member) => {
            if (!member.user_id)
                throw (0, errors_1.INTERNAL)("Error trip.service.trip_sum");
            return await users_service_1.UsersService.get_user_details(member.user_id);
        }));
        const flight = await Flightservice.get_flight(trip_id);
        const flight_detail = flight.map((f) => ({
            flight_id: f.flight_id,
            depart: {
                dep_date: f.dep_date,
                dep_time: f.dep_time,
                dep_country: f.dep_country,
                dep_airp_code: f.dep_airport_code, // map ชื่อ field
            },
            arrive: {
                arr_date: f.arr_date,
                arr_time: f.arr_time,
                arr_country: f.arr_country,
                arr_airp_code: f.arr_airport_code,
            },
            airl_name: f.airline,
        }));
        return {
            trip_detail,
            owner_detail,
            members_detail,
            flight_detail,
        };
    },
};
//# sourceMappingURL=trips.service.js.map