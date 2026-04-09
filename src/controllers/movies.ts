import { Movie } from "../models/movies.ts";
import type { Request, Response } from "express";
import slugify from "slugify";
import mongoose from "mongoose";

const generateSlug = (text: string) => {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
};

//

export const post_movies = async (req: Request, res: Response) => {
  const { name, decripstion, type, genres, country, release_date } = req.body;

  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;

  const posterFile = files?.poster?.[0];
  const backdoorFile = files?.backdoor?.[0];

  const poster = posterFile ? `/uploads/${posterFile.filename}` : undefined;
  const backdoor = backdoorFile
    ? `/uploads/${backdoorFile.filename}`
    : undefined;

  const movie = new Movie({
    name: name?.toLowerCase(),
    decripstion: decripstion,
    slug: generateSlug(name),
    type: type,
    genres: genres,
    poster: poster,
    backdoor: backdoor,
    country: country?.toLowerCase(),
    release_date: release_date,
  });

  try {
    const save = await movie.save();
    if (save) {
      return res.status(200).json({ message: "Save success!" });
    }
    return res.status(400).json({ message: "Save fail!" });
  } catch (e) {
    return res.status(500).json({ message: " Server error", e });
  }
};

//

export const movies_all = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = 16;
  try {
    const total_page = Math.ceil((await Movie.countDocuments()) / limit);
    const movies = await Movie.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (movies) {
      return res
        .status(200)
        .json({ page: page, total_page: total_page, movies: movies });
    }
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

//

export const movies_genres = async (req: Request, res: Response) => {
  try {
    const genreIdParam = req.params.string;
    const genreId = Array.isArray(genreIdParam)
      ? genreIdParam[0]
      : genreIdParam;

    const page = Number(req.query.page) || 1;
    const limit = 10;

    // Convert string to ObjectId for query
    const objectId = new mongoose.Types.ObjectId(genreId);

    const total_page = Math.ceil(
      (await Movie.find({ genres: objectId } as any).countDocuments()) / limit,
    );

    const result = await Movie.find({ genres: objectId } as any)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (result && result.length > 0) {
      return res
        .status(200)
        .json({ page: page, total_page: total_page, movies: result });
    }

    return res.status(404).json({ message: "Not found movie!" });
  } catch (e) {
    return res.status(500).json({ message: "Server error!", e });
  }
};

//

export const movies_type = async (req: Request, res: Response) => {
  try {
    const typeParam = req.params.string;
    const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;

    const page = Number(req.query.page) || 1;
    const limit = 10;

    const total_page = Math.ceil(
      (await Movie.find({
        type: { $regex: `^${type}$`, $options: "i" },
      } as any).countDocuments()) / limit,
    );

    const result = await Movie.find({
      type: { $regex: `^${type}$`, $options: "i" },
    } as any)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (result && result.length > 0) {
      return res
        .status(200)
        .json({ page: page, total_page: total_page, movies: result });
    }

    return res.status(404).json({ message: "Not found movie" });
  } catch (e) {
    return res.status(500).json({ message: "Server error!", e });
  }
};

//

export const movies_country = async (req: Request, res: Response) => {
  try {
    const countryParam = req.params.string;
    const country = Array.isArray(countryParam)
      ? countryParam[0]
      : countryParam;

    const page = Number(req.query.page) || 1;
    const limit = 10;

    const total_page = Math.ceil(
      (await Movie.find({
        country: { $regex: `^${country}$`, $options: "i" },
      } as any).countDocuments()) / limit,
    );

    const result = await Movie.find({
      country: { $regex: `^${country}$`, $options: "i" },
    } as any)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (result && result.length > 0) {
      return res
        .status(200)
        .json({ page: page, total_page: total_page, movies: result });
    }

    return res.status(404).json({ message: "Not found movie" });
  } catch (e) {
    return res.status(500).json({ message: "Server error!", e });
  }
};

//

export const movies_search = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const movies = await Movie.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(10)
      .lean();

    return res.status(200).json({ movies });
  } catch (e) {
    return res.status(500).json({ message: "Server error", e });
  }
};

export const movies_top = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find({}).limit(5).lean();

    return res.status(200).json({ movies });
  } catch (e) {
    return res.status(500).json({ message: "Server error", e });
  }
};

export const movies_slide = async (req: Request, res: Response) => {
  try {
    const single = await Movie.find({ type: "single" }).limit(6).lean();
    const series = await Movie.find({ type: "series" }).limit(6).lean();
    const movie = await Movie.find({ type: "movie" }).limit(6).lean();
    const tvshow = await Movie.find({ type: "tvshow" }).limit(6).lean();

    return res.status(200).json({ movies: { single, series, movie, tvshow } });
  } catch (e) {
    return res.status(500).json({ message: "Server error", e });
  }
};

//
