"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsRepo = void 0;
const db_1 = require("../../config/db");
const trips_schema_1 = require("./trips.schema");
const errors_1 = require("../../core/errors");
const zod_1 = __importDefault(require("zod"));
exports.TripsRepo = {
    async get_user_trips(user_id) {
        const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators tc
				WHERE tc.accepted = TRUE
				GROUP BY trip_id
			)
			SELECT 
				t.trip_id, 
				t.title, 
				jp.joined_people AS joined_people, 
				t.start_date, 
				t.end_date, 
				t.trip_picture_path AS poster_image_link, 
				t.planning_status
			FROM joinedP jp
			JOIN trips t ON jp.trip_id = t.trip_id
			JOIN trip_collaborators tc ON t.trip_id = tc.trip_id
			JOIN users u ON u.user_id = tc.user_id
			WHERE u.user_id = $1
		`;
        const TripsListSchema = zod_1.default.array(trips_schema_1.TripSchema);
        const { rows } = await db_1.pool.query(query, [user_id]);
        const parsed = TripsListSchema.safeParse(rows);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("Fail to parsed data");
        return parsed.data;
    },
    async get_specific_trip(trip_id) {
        const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators tc
				WHERE tc.accepted = TRUE
				GROUP BY trip_id
			)
			SELECT
				t.trip_id, 
				t.title, 
				jp.joined_people AS joined_people, 
				t.start_date, 
				t.end_date, 
				t.trip_picture_path as poster_image_link, 
				t.planning_status
			FROM joinedP jp
			JOIN trips t ON jp.trip_id = t.trip_id
			WHERE t.trip_id = $1
		`;
        const TripListSchema = zod_1.default.array(trips_schema_1.TripSchema);
        const { rows } = await db_1.pool.query(query, [trip_id]);
        const parsed = TripListSchema.safeParse(rows);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("Fail to parsed data");
        return parsed.data;
    },
    async create_trip_base(user_id, title, start_date, end_date, trip_code, trip_pass) {
        const query = `
			INSERT INTO trips (user_id, title, start_date, end_date, trip_code, trip_pass, visibility_status, planning_status, budget)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9)
			RETURNING *
		`;
        const values = [user_id, title, start_date, end_date, trip_code, trip_pass, false, false, 0];
        const result = await db_1.pool.query(query, values);
        return result.rows[0];
    },
    async update_trip_picture(trip_id, trip_picture_path) {
        const query = `
			UPDATE trips
			SET
				trip_picture_path = $1
			WHERE trip_id = $2
			RETURNING *
		`;
        const result = await db_1.pool.query(query, [trip_picture_path, trip_id]);
        return result.rowCount;
    },
    async add_owner_collab(trip_id, user_id, role, accepted) {
        const query = `
			INSERT INTO trip_collaborators (trip_id, user_id, role, accepted)
			VALUES ($1,$2,$3,$4)
			RETURNING *
		`;
        const values = [trip_id, user_id, role, accepted];
        const result = await db_1.pool.query(query, values);
        return result.rowCount; // will be 1 if insert success, 0 if not
    },
    async delete_trip(user_id, trip_id) {
        const query = `
		DELETE 
		FROM trips 
		WHERE user_id = $1 AND trip_id = $2
		RETURNING *`;
        const value = [user_id, trip_id];
        const result = await db_1.pool.query(query, value);
        return result.rowCount;
    },
    async check_owner(owner_id, trip_id) {
        const query = `
			SELECT user_id
			FROM trips
			WHERE trip_id = $1 and user_id = $2
		`;
        const value = [trip_id, owner_id];
        const parsed = await db_1.pool.query(query, value);
        return parsed.rowCount;
    },
    async edit_trip_detail(trip_id, title, start_date, end_date, trip_code, trip_pass, trip_picture_url, planning_status) {
        const query = `
			UPDATE trips
			SET 
				title = COALESCE($1, title),
				start_date = COALESCE($2, start_date),
				end_date = COALESCE($3, end_date),
				trip_code = COALESCE($4, trip_code),
				trip_pass = COALESCE($5, trip_pass),
				trip_picture_path = COALESCE($6, trip_picture_path),
				planning_status = COALESCE($7, planning_status)
			WHERE trip_id = $8
			RETURNING *
		`;
        const values = [title, start_date, end_date, trip_code, trip_pass, trip_picture_url, planning_status, trip_id];
        const result = await db_1.pool.query(query, values);
        return result.rows[0];
    },
    async get_trip_pic(trip_id) {
        const query = `
			SELECT trip_picture_path
			FROM trips
			WHERE trip_id = $1
		`;
        const result = await db_1.pool.query(query, [trip_id]);
        return result.rows[0];
    },
    async change_owner_in_collab(role, collab_id) {
        const query = `
			UPDATE trip_collaborators
			SET
				role = $1
			WHERE collab_id = $2
			RETURNING *
		`;
        const result = await db_1.pool.query(query, [role, collab_id]);
        return result.rowCount;
    },
    async change_owner_in_trips(trip_id, member_id) {
        const query = `
			UPDATE trips
			SET
				user_id = $1
			WHERE trip_id = $2
			RETURNING *
		`;
        const result = await db_1.pool.query(query, [member_id, trip_id]);
        return result.rowCount;
    },
    async leave_collab(user_id, trip_id) {
        const query = `
			DELETE
			FROM trip_collaborators
			WHERE user_id = $1 AND trip_id = $2
			RETURNING *
		`;
        const result = await db_1.pool.query(query, [user_id, trip_id]);
        return result.rowCount;
    },
    async transferOwner(user_id, trip_id, collab_id) {
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            // delete old owner from collab table
            const lt = await client.query(`DELETE FROM trip_collaborators WHERE user_id = $1 AND trip_id = $2 RETURNING *`, [user_id, trip_id]);
            if (lt.rowCount !== 1)
                throw new Error("Leave collab failed");
            // set collab_id to be new owner
            const cco = await client.query(`UPDATE trip_collaborators SET role = 'Owner' WHERE collab_id = $1 RETURNING *`, [collab_id]);
            if (cco.rowCount !== 1)
                throw new Error("Change owner in collaborators failed");
            // set new owner in trips
            const member_id = (await client.query(`SELECT user_id FROM trip_collaborators WHERE collab_id = $1`, [collab_id])).rows[0]?.user_id;
            if (!member_id)
                throw new Error("Member not found");
            const cto = await client.query(`UPDATE trips SET user_id = $1 WHERE trip_id = $2 RETURNING *`, [member_id, trip_id]);
            if (cto.rowCount !== 1)
                throw new Error("Change owner in trips failed");
            await client.query("COMMIT");
            return { success: true };
        }
        catch (err) {
            await client.query("ROLLBACK"); // undo all query
            throw err;
        }
        finally {
            client.release();
        }
    },
    async trip_sum(trip_id) {
        const query = `
			WITH joinedP AS (
				SELECT trip_id, COUNT(user_id)::int AS joined_people
				FROM trip_collaborators tc
				WHERE tc.accepted = TRUE
				GROUP BY trip_id
			)
			SELECT
				t.trip_id, 
				t.title, 
				jp.joined_people AS joined_people, 
				t.start_date, 
				t.end_date,
				t.budget,
				t.trip_picture_path as poster_image_link
			FROM joinedP jp
			JOIN trips t ON jp.trip_id = t.trip_id
			WHERE t.trip_id = $1
		`;
        const TripsListSchema = zod_1.default.array(trips_schema_1.tripsumschema);
        const { rows } = await db_1.pool.query(query, [trip_id]);
        const parsed = TripsListSchema.safeParse(rows);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("Fail to parsed data");
        return parsed.data;
    },
    async get_joinedP(trip_id) {
        const query = `
			SELECT COUNT(user_id)::int AS joined_people
			FROM trip_collaborators tc
			WHERE tc.accepted = TRUE AND tc.trip_id = $1
			GROUP BY trip_id
		`;
        const { rows } = await db_1.pool.query(query, [trip_id]);
        const parsed = trips_schema_1.pschema.safeParse(rows[0]);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("Fail to parsed");
        return parsed.data.joined_people;
    }
};
//# sourceMappingURL=trips.repo.js.map