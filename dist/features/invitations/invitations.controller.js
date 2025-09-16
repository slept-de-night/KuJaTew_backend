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
const service = __importStar(require("./invitations.service"));
const schema = __importStar(require("./invitations.schema"));
const zod_1 = require("zod");
const TEST_USER_ID = "OSHI"; //for testing only
const TEST_ACCEPT_USER_ID = "keen1234";
const TEST_REJECT_USER_ID = "zenne";
const TEST_JOIN_USER_ID = "nutty";
async function invite(req, res, next) {
    try {
        const user_id = TEST_USER_ID; //for testing only
        const { trip_id } = schema.trip_id_schema.parse(req.params);
        const { name } = schema.user_name_schema.parse(req.body);
        const invited = await service.invite(user_id, trip_id, name);
        if (!invited) {
            return res.status(200).json({ message: "user already invited" });
        }
        return res.status(201).json({ message: "Invite successfully" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function code_join(req, res, next) {
    try {
        const user_id = TEST_JOIN_USER_ID; //for testing only
        const { trip_code, trip_pass } = schema.trip_code_password_schema.parse(req.body);
        const joined = await service.code_join(user_id, trip_code, trip_pass);
        if (!joined) {
            return res.status(200).json({ message: "user already joined" });
        }
        return res.status(201).json({ message: "join successfully" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function accept_invite(req, res, next) {
    try {
        const user_id = TEST_ACCEPT_USER_ID; //for testing only
        const { trip_id } = schema.trip_id_schema.parse(req.params);
        const accepted = await service.accept_invite(trip_id, user_id);
        if (!accepted) {
            return res.status(200).json({ message: "user already accept invite" });
        }
        return res.status(201).json({ message: "accept invite successfully" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function reject_invite(req, res, next) {
    try {
        const user_id = TEST_REJECT_USER_ID; //for testing only
        const { trip_id } = schema.trip_id_schema.parse(req.params);
        const rejected = await service.reject_invite(trip_id, user_id);
        if (!rejected) {
            return res.status(200).json({ message: "user already reject invite" });
        }
        return res.status(201).json({ message: "reject invite successfully" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
//# sourceMappingURL=invitations.controller.js.map