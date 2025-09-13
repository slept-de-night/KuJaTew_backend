"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const test_controller_1 = require("./test.controller");
exports.testRouter = (0, express_1.Router)();
exports.testRouter.use('', test_controller_1.getuser);
//# sourceMappingURL=test.routes.js.map