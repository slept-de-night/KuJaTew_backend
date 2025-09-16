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
exports.get_place = get_place;
exports.add_place = add_place;
exports.remove_place = remove_place;
exports.get_guide = get_guide;
exports.add_guide = add_guide;
exports.remove_guide = remove_guide;
const repo = __importStar(require("./bookmarks.repo"));
async function get_place(userId) {
    return repo.get_place(userId);
}
async function add_place(userId, placeId) {
    return repo.add_place(userId, placeId);
}
async function remove_place(userId, placeId) {
    return repo.remove_place(userId, placeId);
}
async function get_guide(userId) {
    return repo.get_guide(userId);
}
async function add_guide(userId, trip_id) {
    return repo.add_guide(userId, trip_id);
}
async function remove_guide(userId, gbookmark_id) {
    return repo.remove_guide(userId, gbookmark_id);
}
//# sourceMappingURL=bookmarks.service.js.map