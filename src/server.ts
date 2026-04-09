import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.ts";
import { router } from "./routers/action.ts";
import path from "path";

dotenv.config();

const server = express();
server.use(cors(corsOptions));

server.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-frontend.vercel.app", // domain production của bạn
];

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép request không có origin (Postman, mobile app, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

server.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src", "uploads")),
);
server.use(router);


try {
  await connectDB();
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
} catch (err) {
  console.error("Error starting server:", err);
}
