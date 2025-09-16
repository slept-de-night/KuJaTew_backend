
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z)

import express from "express";
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import YAML from 'yaml';
import { errorHandler } from "./core/middleware/errorHandler";
import { usersRouter, usersRouterPublic } from "./features/users/users.routes";
import { authHandler } from "./core/middleware/authHandler";
import { testRouter } from "./test/test.routes";
import { pool } from "./config/db";

import { placeinfoRoute } from "./features/places_info/places-info.routes";
import { buildOpenApiDoc } from "./common/openapi";


import { tripsRouter} from "./features/trips/trips.routes";
import { memberRouter } from "./features/member/member.routes";
import { bookmarkRouter } from "./features/bookmarks/bookmarks.routes"; //e
import { flightRouter } from "./features/flights/flights.routes"; //e
import { inviteRouter } from "./features/invitations/invitations.routes"; //e
import { activityRouter } from "./features/activity/activity.routes" //zennnne!!!


export function buildApp(){
    

    const app=express();
    const openApiDoc = buildOpenApiDoc();
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
    app.use(express.json({ limit: '1mb' }));

    app.use('/api/users', bookmarkRouter); //e
    app.use('/api/trips', flightRouter); //e
    app.use('/api/trips', inviteRouter); //e

    app.use('/api/users', usersRouterPublic);
    
    app.use(authHandler);

    //route without authentication
    app.use('/api/test',testRouter);
    app.use('/api/trips', tripsRouter);
    app.use('/api/trips/members', memberRouter);
    app.use('/api/users', bookmarkRouter); //e
    app.use('/api/trips', flightRouter); //e
    app.use('/api/trips', inviteRouter); //e
    app.use('/api/trips/:trip_id/activities', activityRouter);
    
    // route without authentication
    app.use('/api/places',placeinfoRoute);
    app.use('/api/users', usersRouter);

    app.use(errorHandler);
    
    return app;
}
