"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouterPublic = exports.usersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const multer_1 = __importDefault(require("multer"));
const refreshTokenHandler_1 = require("../../core/middleware/refreshTokenHandler");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouterPublic = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.usersRouter.get('get-user-details', users_controller_1.getUsersDetails);
exports.usersRouterPublic.post('login', upload.single('profile'), users_controller_1.loginUser);
exports.usersRouterPublic.get('refresh-token', refreshTokenHandler_1.refreshTokenHandler, users_controller_1.getTokenRefresh);
exports.usersRouter.get('update-user', users_controller_1.updateUser);
//# sourceMappingURL=users.routes.js.map