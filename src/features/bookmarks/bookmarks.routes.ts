import { Router } from "express";
import * as controller from "./bookmarks.controller";

const router = Router();

router.post("/", controller.add_place_bookmark);      // POST /api/bookmarks { place_id }
router.delete("/", controller.remove_place_bookmark); // DELETE /api/bookmarks { place_id }

export default router;
