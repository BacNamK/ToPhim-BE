import { request } from "express";
import mongoose from "mongoose";

const movieschema = new mongoose.Schema(
  {
    name: {
      type: String,
      request: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    decripstion: {
      type: String,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["single", "series", "tvshow", "movie"],
    },
    genres: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "genres",
      },
    ],
    poster: {
      type: String,
    },
    backdoor: {
      type: String,
    },
    country: {
      type: String,
    },
    release_date: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Movie = mongoose.model("Movie", movieschema);
