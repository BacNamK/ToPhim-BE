import type { Request, Response } from "express";
import Episodes from "../models/episodes.ts";
import { Movie } from "../models/movies.ts";

export const post_episodes = async (req: Request, res: Response) => {
  const { title, resources, from } = req.body;

  if (!title || !resources || !from) {
    return res.status(400).json({
      message: "Missing required fields: title, resources, from",
    });
  }

  try {
    const movie = await Movie.findById(from).lean();
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const episode = new Episodes({
      title: title,
      resources: resources,
      from: from,
    });

    const saved = await episode.save();
    if (saved) {
      return res.status(200).json({ message: "Save success!" });
    }
    return res.status(400).json({ message: "Save fail!" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", e });
  }
};

export const get_episodes = async (req: Request, res: Response) => {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(400).json({
      message: "Missing movieId",
    });
  }

  try {
    const episodes = await Episodes.find({ from: movieId }).sort({
      createdAt: 1,
    });
    return res.status(200).json({ episodes });
  } catch (e) {
    return res.status(500).json({ message: "Server error", e });
  }
};
