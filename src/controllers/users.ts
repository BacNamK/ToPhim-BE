import crypto from "crypto";
import { Users } from "../models/users.ts";
import type { Request, Response, NextFunction } from "express";

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, storedPassword: string) => {
  const [salt, storedHash] = String(storedPassword).split(":");
  if (!salt || !storedHash) return false;

  const computedHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(storedHash, "hex"),
    Buffer.from(computedHash, "hex"),
  );
};

//

export const register = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "username, email, password are required" });
  }
  console.log("REGISTER: using passwordHash field");

  const exited_Name = await Users.findOne({ username: username.toLowerCase() });
  const exited_Email = await Users.findOne({ email: email.toLowerCase() });

  if (exited_Name) {
    return res
      .status(400)
      .json({ error: "This user name is already in use !" });
  }

  if (exited_Email) {
    return res.status(400).json({ error: "Email " });
  }

  const user = new Users({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: false,
  });

  try {
    await user.save();
    return res.status(200).json({ message: "Register success!" });
  } catch (e) {
    return res.status(500).json({ message: "Server error !" });
  }
};

//

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user_exited = await Users.findOne({ email: email.toLowerCase() });

    if (!user_exited) {
      return res.status(404).json({ message: "Can not find this email !" });
    }

    const isValidPassword = verifyPassword(password, user_exited?.passwordHash);

    if (!isValidPassword) {
      return res.status(404).json({ message: "Wrong password !" });
    }

    if (user_exited && isValidPassword) {
      return res
        .status(200)
        .json({ message: "Login Success !", username: user_exited.username });
    }
  } catch (e) {
    return res.status(500).json({ message: "Server error !" });
  }
};

//

export const get_user = async (req: Request, res: Response) => {
  const paragraph = req.body.username;

  if (!paragraph) return;

  try {
    const find_user = await Users.find({ username: paragraph });

    if (find_user) {
      return res.status(200).json(find_user);
    }
  } catch (e) {
    return res.status(500).json({ message: "Server error !" });
  }
};

//

export const get_users = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const total_page = Math.ceil((await Users.countDocuments()) / 10);

  try {
    const users = await Users.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({ users, page: page, total_page: total_page });
  } catch (e) {
    return res.status(400).json({ message: "Server error" });
  }
};
