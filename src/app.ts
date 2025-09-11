import express from "express";
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import YAML from 'yaml';
import { errorHandler } from "./core/middleware/errorHandler";
import { usersRouter, usersRouterPublic } from "./features/users/users.routes";
import { authHandler } from "./core/middleware/authHandler";
import { testRouter } from "./test/test.routes";
import { pool } from "./config/db";
import { tripsRouter} from "./features/trips/trips.routes";
import { memberRouter } from "./features/member/member.routes";
import { bookmarkRouter } from "./features/bookmarks/bookmarks.routes"; //e
import { flightRouter } from "./features/flights/flights.routes"; //e
import { inviteRouter } from "./features/invitations/invitations.routes"; //e

export function buildApp(){

    const app=express();
    const file = fs.readFileSync('./swagger.yaml', 'utf8');
    const swaggerDocument = YAML.parse(file);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(express.json({ limit: '1mb' }));

    //route without authentication
    app.use('/api/test',testRouter);
    app.use('/api/trips', tripsRouter);
    app.use('/api/trips/members', memberRouter);
    app.use('/api/users', bookmarkRouter); //e
    app.use('/api/trips', flightRouter); //e
    app.use('/api/trips', inviteRouter); //e
    app.use('/api/users', usersRouterPublic);

    //app.use(authHandler);

    // route without authentication
    app.use('/api/users', usersRouter);

    app.use(errorHandler);
    
    return app;
}
