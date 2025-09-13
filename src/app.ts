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


export function buildApp(){
    

    const app=express();
    const openApiDoc = buildOpenApiDoc();
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
    app.use(express.json({ limit: '1mb' }));

    // route without authentication
    app.use('/api/test',testRouter);
    app.use('/api/users', usersRouterPublic);

    app.use(authHandler);
    
    // route without authentication
    app.use('/api/places',placeinfoRoute);
    app.use('/api/users', usersRouter);

    app.use(errorHandler);
    
    return app;
}
