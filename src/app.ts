
import express from "express";
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import YAML from 'yaml';
import { errorHandler } from "./core/middleware/errorHandler";
import { usersRouter } from "./features/users/users.routes";

export function buildApp(){
    const app=express();
    const file = fs.readFileSync('./swagger.yaml', 'utf8');
    const swaggerDocument = YAML.parse(file);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(express.json({ limit: '1mb' }));
    app.use('/api/users', usersRouter);

    app.use(errorHandler);
    
    return app;
}
