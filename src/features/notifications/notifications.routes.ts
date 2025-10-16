import { Router } from "express";
import * as controller from "./notifications.controller";

export const notificationsRouter = Router();

notificationsRouter.get("/notifications/:trip_id", controller.get_notifications); //NOT DONE | NOT TEST
notificationsRouter.post("/:trip_id/notifications", controller.post_notifications); //NOT DONE | NOT TEST

notificationsRouter.get("/notifications/:trip_id/peruser", controller.get_notifications); //NOT DONE | NOT TEST