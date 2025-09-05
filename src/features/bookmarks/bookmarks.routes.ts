import { Router } from "express";
import * as controller from "./bookmarks.controller";

export const bookmarkRouter = Router();

bookmarkRouter.get("/bookmarks/places", controller.get_place_bookmark); //functioning with user_id = OSHI
bookmarkRouter.post("/bookmarks/places/:place_id", controller.post_place_bookmark); //Not tested yet
bookmarkRouter.delete("/bookmarks/places/:bookmark_id", controller.delete_place_bookmark); //Not tested yet

bookmarkRouter.get("/bookmarks/guides", controller.get_guide_bookmark); //functioning with user_id = OSHI
bookmarkRouter.post("/bookmarks/guides/:trip_id", controller.post_guide_bookmark); //Not tested yet
bookmarkRouter.delete("/bookmarks/guides/:gbookmark_id", controller.delete_guide_bookmark); //Not tested yet
