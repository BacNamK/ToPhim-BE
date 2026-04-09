import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.ts";
import { router } from "./routers/action.ts";
import path from "path";

dotenv.config();

const server = express();

server.use(express.json());
server.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src", "uploads")),
);
server.use(router);

const corsOptions = {
  origin: "http://localhost:5173", // Thay thế bằng URL frontend của bạn
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức HTTP được phép
  credentials: true, // Cho phép gửi cookie và header Authorization
  optionsSuccessStatus: 204, // Một số trình duyệt cũ (IE11, một số SmartTV) không xử lý 200 cho preflight
};

server.use(cors(corsOptions));

try {
  await connectDB();
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
} catch (err) {
  console.error("Error starting server:", err);
}
