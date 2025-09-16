"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRepo = void 0;
const db_1 = require("../../config/db");
const member_schema_1 = require("./member.schema");
const errors_1 = require("../../core/errors");
const zod_1 = __importDefault(require("zod"));
exports.MemberRepo = {
    async get_trip_members(trip_id) {
        const query = `
			SELECT
				tc.collab_id,
				u.profile_picture_path as profile_picture_link,
				u.name,
				u.email,
				u.phone,
				tc.role
			FROM users u
			JOIN trip_collaborators tc ON u.user_id = tc.user_id
			WHERE tc.trip_id = $1
		`;
        const result = await db_1.pool.query(query, [trip_id]);
        return result.rows;
    },
    async is_in_trip(user_id, trip_id) {
        const query = `
			SELECT *
			FROM trip_collaborators
			WHERE user_id = $1 AND trip_id = $2
		`;
        const result = await db_1.pool.query(query, [user_id, trip_id]);
        return result.rowCount; // 1 if in 0 if not
    },
    async edit_role(role, trip_id, collab_id) {
        const query = `
			UPDATE trip_collaborators
			SET
				role = $1
			WHERE collab_id = $2 AND trip_id = $3
			RETURNING *
		`;
        const result = await db_1.pool.query(query, [role, collab_id, trip_id]);
        return result.rows[0];
    },
    async delete_member(collab_id, trip_id) {
        const query = `
			DELETE
			FROM trip_collaborators
			WHERE collab_id = $1 AND trip_id = $2
			RETURNING *
		`;
        const result = await db_1.pool.query(query, [collab_id, trip_id]);
        return result.rowCount;
    },
    async get_memberid(trip_id) {
        const query = `
			SELECT 
				user_id,
				role
			FROM trip_collaborators
			WHERE trip_id = $1
		`;
        const { rows } = await db_1.pool.query(query, [trip_id]);
        const urlist = zod_1.default.array(member_schema_1.urSchema);
        const parsed = urlist.safeParse(rows);
        if (!parsed.success)
            throw (0, errors_1.INTERNAL)("Fail to parsed");
        return parsed.data;
    },
};
//# sourceMappingURL=member.repo.js.map