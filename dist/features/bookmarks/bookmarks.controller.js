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
exports.get_place_bookmark = get_place_bookmark;
exports.post_place_bookmark = post_place_bookmark;
exports.delete_place_bookmark = delete_place_bookmark;
exports.get_guide_bookmark = get_guide_bookmark;
exports.post_guide_bookmark = post_guide_bookmark;
exports.delete_guide_bookmark = delete_guide_bookmark;
const service = __importStar(require("./bookmarks.service"));
const schema = __importStar(require("./bookmarks.schema"));
const zod_1 = require("zod");
const TEST_USER_ID = "OSHI"; //for testing only //OSHI
async function get_place_bookmark(req, res, next) {
    try {
        const userId = TEST_USER_ID; //for testing only
        const bookmarks = await service.get_place(userId);
        return res.status(200).json({ bookmarks });
    }
    catch (err) {
        next(err);
    }
}
async function post_place_bookmark(req, res, next) {
    try {
        const userId = TEST_USER_ID; //for testing only
        const { place_id } = schema.place_id_schema.parse(req.params);
        const inserted = await service.add_place(userId, place_id);
        if (!inserted) {
            return res.status(200).json({ message: "Bookmark already exist" });
        }
        return res.status(201).json({ message: "Bookmark added" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function delete_place_bookmark(req, res, next) {
    try {
        const userId = TEST_USER_ID; //for testing only
        const { bookmark_id } = schema.bookmark_id_schema.parse(req.params);
        const removed = await service.remove_place(userId, bookmark_id);
        if (!removed) {
            return res.status(404).json({ message: "Bookmark not found" });
        }
        return res.status(200).json({ message: "Bookmark removed" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function get_guide_bookmark(req, res, next) {
    try {
        const userId = TEST_USER_ID; //for testing only
        const guide_bookmarks = await service.get_guide(userId);
        return res.status(200).json({ guide_bookmarks });
    }
    catch (err) {
        next(err);
    }
}
async function post_guide_bookmark(req, res, next) {
    try {
        const userId = TEST_USER_ID; //for testing only
        const { trip_id } = schema.trip_id_schema.parse(req.params);
        const inserted = await service.add_guide(userId, trip_id);
        if (!inserted) {
            return res.status(200).json({ message: "Bookmark already exist" });
        }
        return res.status(201).json({ message: "Bookmark added" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
async function delete_guide_bookmark(req, res, next) {
    try {
        const userId = TEST_USER_ID; //for testing only
        const { gbookmark_id } = schema.gbookmark_id_schema.parse(req.params);
        const removed = await service.remove_guide(userId, gbookmark_id);
        if (!removed) {
            return res.status(404).json({ message: "Bookmark not found" });
        }
        return res.status(200).json({ message: "Bookmark removed" });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
        }
        next(err);
    }
}
//# sourceMappingURL=bookmarks.controller.js.map