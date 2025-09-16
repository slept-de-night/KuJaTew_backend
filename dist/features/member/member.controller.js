"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete_Member = exports.Edit_Role = exports.Trip_Members = void 0;
const member_service_1 = require("./member.service");
const member_schema_1 = require("./member.schema");
const http_1 = require("../../core/http");
const errors_1 = require("../../core/errors");
exports.Trip_Members = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = member_schema_1.utSchema.safeParse(req.params);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalid Request");
    const { trip_id, user_id } = parsed.data;
    const members = await member_service_1.MemberService.get_trip_member(user_id, trip_id);
    return res.status(200).json(members);
});
exports.Edit_Role = (0, http_1.asyncHandler)(async (req, res) => {
    const parsedparams = member_schema_1.utSchema.safeParse(req.params);
    if (!parsedparams.success)
        throw (0, errors_1.BadRequest)("Invalid Params Request");
    const parsedbody = member_schema_1.roleSchema.safeParse(req.body);
    if (!parsedbody.success)
        throw (0, errors_1.BadRequest)("Invalid Body Request");
    const { user_id, trip_id } = parsedparams.data;
    const { collab_id, role } = parsedbody.data;
    const result = await member_service_1.MemberService.edit_role(user_id, trip_id, collab_id, role);
    return res.status(200).json(result);
});
exports.Delete_Member = (0, http_1.asyncHandler)(async (req, res) => {
    const parsed = member_schema_1.utcSchema.safeParse(req.params);
    if (!parsed.success)
        throw (0, errors_1.BadRequest)("Invalid Request");
    const { user_id, trip_id, collab_id } = parsed.data;
    const result = await member_service_1.MemberService.delete_member(user_id, trip_id, collab_id);
    return res.status(200).json(result);
});
//# sourceMappingURL=member.controller.js.map