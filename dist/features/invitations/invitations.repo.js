"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invite = invite;
exports.code_join = code_join;
exports.accept_invite = accept_invite;
exports.reject_invite = reject_invite;
const db_1 = require("../../core/db");
async function invite(inviter_user_id, trip_id, invited_user_name) {
    const check_sql = `
  SELECT *
  FROM trip_collaborators
  WHERE trip_id = $1 AND user_id = $2 AND (role = 'Owner' OR role = 'Editor')
  LIMIT 1
  `;
    const check_res = await (0, db_1.query)(check_sql, [trip_id, inviter_user_id]);
    if (check_res.rowCount === 0) {
        throw new Error("Permission denied: inviter is not Owner/Editor");
    }
    const user_name_match = `
  SELECT user_id
  FROM users
  WHERE name = $1
  LIMIT 1
  `;
    const check_user_id = await (0, db_1.query)(user_name_match, [invited_user_name]);
    if (check_user_id.rowCount === 0) {
        throw new Error("user name doesn't exist");
    }
    const invited_user_id = check_user_id.rows[0].user_id;
    const sql = `
    INSERT INTO trip_collaborators (trip_id, user_id, role, accepted)
    VALUES ($1, $2, 'viewer', false)
    ON CONFLICT (trip_id, user_id) DO NOTHING
  `;
    const res = await (0, db_1.query)(sql, [trip_id, invited_user_id]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}
async function code_join(user_id, trip_code, trip_password) {
    const pass_and_code_check = `
  SELECT trip_id
  FROM trips
  WHERE trip_code = $1 AND trip_pass = $2
  LIMIT 1
`;
    const check_res = await (0, db_1.query)(pass_and_code_check, [trip_code, trip_password,]);
    if (check_res.rowCount === 0) {
        throw new Error("wrong trip code or password");
    }
    const trip_id = check_res.rows[0].trip_id;
    const sql = `
    INSERT INTO trip_collaborators (trip_id, user_id, role, accepted)
    VALUES ($1, $2, 'viewer', true)
    ON CONFLICT (trip_id, user_id) DO UPDATE
      SET accepted = true
  `;
    const res = await (0, db_1.query)(sql, [trip_id, user_id]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}
async function accept_invite(trip_id, user_id) {
    const check_match_user = `
  SELECT *
  FROM trip_collaborators
  WHERE trip_id = $1 AND user_id = $2 AND accepted = false
  LIMIT 1
  `;
    const check_match = await (0, db_1.query)(check_match_user, [trip_id, user_id,]);
    if (check_match.rowCount === 0) {
        throw new Error("user_id doesn't match / already accepted / wrong trip_id");
    }
    const sql = `
    UPDATE trip_collaborators
    SET accepted = true
    WHERE trip_id = $1 AND user_id = $2
  `;
    const res = await (0, db_1.query)(sql, [trip_id, user_id]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}
async function reject_invite(trip_id, user_id) {
    const check_match_user = `
  SELECT *
  FROM trip_collaborators
  WHERE trip_id = $1 AND user_id = $2 AND accepted = false
  LIMIT 1
  `;
    const check_match = await (0, db_1.query)(check_match_user, [trip_id, user_id,]);
    if (check_match.rowCount === 0) {
        throw new Error("user_id doesn't match / already accepted / wrong trip_id");
    }
    const sql = `DELETE FROM trip_collaborators WHERE trip_id = $1 AND user_id = $2`;
    const res = await (0, db_1.query)(sql, [trip_id, user_id]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
}
//# sourceMappingURL=invitations.repo.js.map