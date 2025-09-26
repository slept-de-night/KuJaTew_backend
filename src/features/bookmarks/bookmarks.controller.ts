import { Request, Response, NextFunction } from "express";
import * as service from "./bookmarks.service";
import * as schema from "./bookmarks.schema";
import { z, ZodError } from "zod";
import { BadRequest } from '../../core/errors';
import { etcService } from '../../etc/etc.service';

export async function get_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const rows = await service.get_place(user_id);

    const bookmarks = await Promise.all(
      rows.map(async (row) => {
        if (row.places_picture_path) {
          const { signedUrl } = await etcService.get_file_link(row.places_picture_path, "places", 3600);
          row.places_picture_path = signedUrl;
        }
        return row;
      })
    );
    return res.status(200).json({ bookmarks });
  } catch (err) {
    next(err);
  }
}

export async function post_place_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;
    const { place_id } = schema.place_id_schema.parse(req.params);

    const inserted = await service.add_place(user_id, place_id);
    if (!inserted) {
      return res.status(409).json({ message: "Place already bookmarked by user" });
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
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { bookmark_id } = schema.bookmark_id_schema.parse(req.params);

    const removed = await service.remove_place(user_id, bookmark_id);
    if (!removed) {
      return res.status(404).json({ message: "Place doesn't exist in user's bookmark" });
    }
    return res.status(200).json({ message: "Place from user's bookmark removed" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}

export async function get_guide_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const rows = await service.get_guide(user_id);

    const guide_bookmarks = await Promise.all(
      rows.map(async (row) => {
        if (row.trip_picture_path) {
          const { signedUrl } = await etcService.get_file_link(row.trip_picture_path, "posters", 3600);
          row.trip_picture_path = signedUrl;
        }
        return row;
      })
    );
    return res.status(200).json({ guide_bookmarks });
  } catch (err) {
    next(err);
  }
}

export async function post_guide_bookmark(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { trip_id } = schema.trip_id_schema.parse(req.params);

    const inserted = await service.add_guide(user_id, trip_id);
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
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user);
    if(!parsed.success) throw BadRequest("Invalide Request");
    const { user_id } = parsed.data;

    const { gbookmark_id } = schema.gbookmark_id_schema.parse(req.params);

    const removed = await service.remove_guide(user_id, gbookmark_id);
    if (!removed) {
      return res.status(404).json({ message: "Guide doesn't exist inside user's bookmark" });
    }
    return res.status(200).json({ message: "Removed Guide from user's bookmark" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
    }
    next(err);
  }
}