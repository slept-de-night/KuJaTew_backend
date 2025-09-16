"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const errorHandler_1 = require("./core/middleware/errorHandler");
const users_routes_1 = require("./features/users/users.routes");
const authHandler_1 = require("./core/middleware/authHandler");
const test_routes_1 = require("./test/test.routes");
const places_info_routes_1 = require("./features/places_info/places-info.routes");
const openapi_1 = require("./common/openapi");
const trips_routes_1 = require("./features/trips/trips.routes");
const member_routes_1 = require("./features/member/member.routes");
const bookmarks_routes_1 = require("./features/bookmarks/bookmarks.routes"); //e
const flights_routes_1 = require("./features/flights/flights.routes"); //e
const invitations_routes_1 = require("./features/invitations/invitations.routes"); //e
const activity_routes_1 = require("./features/activity/activity.routes"); //zennnne!!!
function buildApp() {
    const app = (0, express_1.default)();
    const openApiDoc = (0, openapi_1.buildOpenApiDoc)();
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiDoc));
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use('/api/users', users_routes_1.usersRouterPublic);
    app.use(authHandler_1.authHandler);
    //route without authentication
    app.use('/api/test', test_routes_1.testRouter);
    app.use('/api/trips', trips_routes_1.tripsRouter);
    app.use('/api/trips/members', member_routes_1.memberRouter);
    app.use('/api/users', bookmarks_routes_1.bookmarkRouter); //e
    app.use('/api/trips', flights_routes_1.flightRouter); //e
    app.use('/api/trips', invitations_routes_1.inviteRouter); //e
    app.use('/api/trips/:trip_id/activities', activity_routes_1.activityRouter);
    // route without authentication
    app.use('/api/places', places_info_routes_1.placeinfoRoute);
    app.use('/api/users', users_routes_1.usersRouter);
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map