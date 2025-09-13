import { Router } from 'express';
import * as controller from './places-info.controller';
export const placeinfoRoute = Router();

placeinfoRoute.get('/autocomplete/:input',controller.autocomplete);
placeinfoRoute.get('/:id/:type',controller.places_details);