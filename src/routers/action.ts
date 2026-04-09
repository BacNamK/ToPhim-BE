import express from "express";
import { register, login, get_users, get_user } from "../controllers/users.ts";
import {
  movies_genres,
  post_movies,
  movies_type,
  movies_country,
  movies_all,
  movies_search,
  movies_top,
  movies_slide,
} from "../controllers/movies.ts";
import { get_genres, get_genre_by_id } from "../controllers/genres.ts";
import { post_episodes, get_episodes } from "../controllers/episodes.ts";
import { upload } from "../middleware/upload.ts";

export const router = express.Router();

//
router.post("/register", register);
router.post("/login", login);
//
router.get("/manage/user", get_user);
router.get("/manage/users/", get_users);
//
router.post(
  "/manage/movie",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdoor", maxCount: 1 },
  ]),
  post_movies,
);
//
router.post("/manage/episode", upload.none(), post_episodes);
router.get("/manage/episodes/:movieId", get_episodes);
//
router.get("/movies_top", movies_top);
//
router.get("/movies_slide", movies_slide);
//
router.get("/movies", movies_all);
router.get(`/movies/genres/:string`, movies_genres);
router.get(`/movies/type/:string`, movies_type);
router.get(`/movies/country/:string`, movies_country);
router.get("/movies/search", movies_search);
//
router.get("/genres", get_genres);
router.get("/genres/:id", get_genre_by_id);
