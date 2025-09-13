"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const errorHandler_1 = require("./core/middleware/errorHandler");
const users_routes_1 = require("./features/users/users.routes");
const authHandler_1 = require("./core/middleware/authHandler");
const test_routes_1 = require("./test/test.routes");
const places_info_routes_1 = require("./features/places_info/places-info.routes");
function buildApp() {
    const app = (0, express_1.default)();
    const file = fs_1.default.readFileSync('./swagger.yaml', 'utf8');
    const swaggerDocument = yaml_1.default.parse(file);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    app.use(express_1.default.json({ limit: '1mb' }));
    // route without authentication
    app.use('/api/test', test_routes_1.testRouter);
    app.use('/api/users', users_routes_1.usersRouterPublic);
    app.use(authHandler_1.authHandler);
    // route without authentication
    app.use('/api/places', places_info_routes_1.placeinfoRoute);
    app.use('/api/users', users_routes_1.usersRouter);
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map