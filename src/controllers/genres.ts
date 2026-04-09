import type { Request, Response } from "express";
import { Genres } from "../models/genres.ts";

export const get_genres = async (req: Request, res: Response) => {
  try {
    const genres = await Genres.find({}).lean();
    if (genres) {
      return res.status(200).json({ genres: genres });
    }
    return res.status(404).json({ message: "No genres found" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", e });
  }
};

export const get_genre_by_id = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const genre = await Genres.findById(id).lean();
    if (genre) {
      return res.status(200).json({ genre: genre });
    }
    return res.status(404).json({ message: "Genre not found" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", e });
  }
};
