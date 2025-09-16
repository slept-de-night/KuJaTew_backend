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
exports.invite = invite;
exports.code_join = code_join;
exports.accept_invite = accept_invite;
exports.reject_invite = reject_invite;
const repo = __importStar(require("./invitations.repo"));
async function invite(inviter_user_id, trip_id, invited_user_name) {
    return repo.invite(inviter_user_id, trip_id, invited_user_name);
}
async function code_join(user_id, trip_code, trip_password) {
    return repo.code_join(user_id, trip_code, trip_password);
}
async function accept_invite(trip_id, user_id) {
    return repo.accept_invite(trip_id, user_id);
}
async function reject_invite(trip_id, user_id) {
    return repo.reject_invite(trip_id, user_id);
}
//# sourceMappingURL=invitations.service.js.map