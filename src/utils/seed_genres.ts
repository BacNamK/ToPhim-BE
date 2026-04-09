import { Genres } from "../models/genres.ts";
import { connectDB } from "../config/database.ts";
import mongoose from "mongoose";

const seedGenres = async () => {
  await connectDB();

  const genresData = [
    {
      _id: new mongoose.Types.ObjectId("69d361366732faecf486ec34"),
      name: "horror",
    },
    {
      _id: new mongoose.Types.ObjectId("69d361366732faecf486ec35"),
      name: "romance",
    },
    {
      _id: new mongoose.Types.ObjectId("69d361366732faecf486ec36"),
      name: "sci-fi",
    },
    {
      _id: new mongoose.Types.ObjectId("69d361366732faecf486ec30"),
      name: "adventure",
    },
    {
      _id: new mongoose.Types.ObjectId("69d361366732faecf486ec31"),
      name: "comedy",
    },
    {
      _id: new mongoose.Types.ObjectId("69d361366732faecf486ec32"),
      name: "drama",
    },
    {
      _id: new mongoose.Types.ObjectId("69d361366732faecf486ec33"),
      name: "fantasy",
    },
    { name: "action" },
    { name: "thriller" },
  ];

  try {
    // Xóa genres cũ
    await Genres.deleteMany({});

    // Insert genres mới với custom IDs
    await Genres.insertMany(genresData);
    console.log("Seed genres done successfully!");
  } catch (err) {
    console.error("Seed genres error:", err);
  }
};

seedGenres()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed genres failed:", err);
    process.exit(1);
  });
