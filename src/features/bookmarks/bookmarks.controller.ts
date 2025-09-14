import { Request, Response, NextFunction } from "express";
import * as service from "./bookmarks.service";
import * as schema from "./bookmarks.schema";
import { ZodError } from "zod";

const TEST_USER_ID = "OSHI"; //for testing only //OSHI

export async function get_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = TEST_USER_ID; //for testing only

    const bookmarks = await service.get_place(userId);
    return res.status(200).json({ bookmarks });
  } catch (err) {
    next(err);
  }
}

export async function post_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = TEST_USER_ID; //for testing only

    const { place_id } = schema.place_id_schema.parse(req.params);

    const inserted = await service.add_place(userId, place_id);
    if (!inserted) {
      return res.status(200).json({ message: "Bookmark already exist" });
    }
    return res.status(201).json({ message: "Bookmark added" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function delete_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = TEST_USER_ID; //for testing only

    const { bookmark_id } = schema.bookmark_id_schema.parse(req.params);

    const removed = await service.remove_place(userId, bookmark_id);
    if (!removed) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    return res.status(200).json({ message: "Bookmark removed" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function get_guide_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = TEST_USER_ID; //for testing only

    const guide_bookmarks = await service.get_guide(userId);
    return res.status(200).json({ guide_bookmarks });
  } catch (err) {
    next(err);
  }
}

export async function post_guide_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = TEST_USER_ID; //for testing only

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const inserted = await service.add_guide(userId, trip_id);
    if (!inserted) {
      return res.status(200).json({ message: "Bookmark already exist" });
    }
    return res.status(201).json({ message: "Bookmark added" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function delete_guide_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = TEST_USER_ID; //for testing only

    const { gbookmark_id } = schema.gbookmark_id_schema.parse(req.params);

    const removed = await service.remove_guide(userId, gbookmark_id);
    if (!removed) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    return res.status(200).json({ message: "Bookmark removed" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}