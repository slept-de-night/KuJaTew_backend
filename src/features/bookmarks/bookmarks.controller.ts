import { Request, Response, NextFunction } from "express";
import * as service from "./bookmarks.service";
import * as schema from "./bookmarks.schema";
import { ZodError } from "zod";

// For local testing when user_id isn't provided in the body
const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export async function get_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.body?.user_id as string) || TEST_USER_ID;
    // no body validation needed unless you add filters/pagination
    const bookmarks = await service.get_place(userId); // returns array of joined places
    return res.status(200).json({ bookmarks });
  } catch (err) {
    next(err);
  }
}

export async function add_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    // ✅ no auth; get user_id from body (or fallback)
    const userId = (req.body?.user_id as string) || TEST_USER_ID;

    // validate only the fields you care about here
    const { place_id } = schema.add_place_bookmark.parse(req.body);

    const inserted = await service.add_place(userId, place_id);
    if (!inserted) {
      return res.status(200).json({ message: "Bookmark already exist" });
    }
    return res.status(201).json({ message: "Bookmark added" });
  } catch (err) {
    if (err instanceof ZodError) {
      // 400 for invalid input
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function remove_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.body?.user_id as string) || TEST_USER_ID;

    const { place_id } = schema.remove_place_bookmark.parse(req.body);

    const removed = await service.remove_place(userId, place_id);
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
    const userId = (req.body?.user_id as string) || TEST_USER_ID;
    // no body validation needed unless you add filters/pagination
    const guide_bookmarks = await service.get_guide(userId); // returns array of joined places
    return res.status(200).json({ guide_bookmarks });
  } catch (err) {
    next(err);
  }
}

export async function add_guide_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    // ✅ no auth; get user_id from body (or fallback)
    const userId = (req.body?.user_id as string) || TEST_USER_ID;

    // validate only the fields you care about here
    const { trip_id } = schema.add_guide_bookmark.parse(req.body);

    const inserted = await service.add_place(userId, trip_id);
    if (!inserted) {
      return res.status(200).json({ message: "Bookmark already exist" });
    }
    return res.status(201).json({ message: "Bookmark added" });
  } catch (err) {
    if (err instanceof ZodError) {
      // 400 for invalid input
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function remove_guide_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.body?.user_id as string) || TEST_USER_ID;

    const { trip_id } = schema.remove_guide_bookmark.parse(req.body);

    const removed = await service.remove_place(userId, trip_id);
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