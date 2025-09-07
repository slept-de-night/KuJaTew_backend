import { Router } from "express";
import * as controller from "./invitations.controller";

export const inviteRouter = Router();

inviteRouter.post("/{trip_id}/invite", controller.invite);
inviteRouter.post("/invite/self ", controller.code_join);

inviteRouter.patch("/{trip_id}/invite/accept", controller.accept_invite);
inviteRouter.delete("/{trip_id}/invite/reject", controller.reject_invite);