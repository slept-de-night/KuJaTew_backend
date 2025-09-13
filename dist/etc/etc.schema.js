"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFileSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.ImageFileSchema = zod_1.default.object({
    fieldname: zod_1.default.literal('image'),
    originalname: zod_1.default.string(),
    encoding: zod_1.default.string(),
    mimetype: zod_1.default.union([zod_1.default.literal('image/jpeg'), zod_1.default.literal('image/jpg'), zod_1.default.literal('image/png')]),
    buffer: zod_1.default.instanceof(Buffer),
    size: zod_1.default.number().max(5 * 1024 * 1024, 'Max 5MB'),
});
//# sourceMappingURL=etc.schema.js.map