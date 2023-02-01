import "../../../loadEnviroment.js";
import environment from "../../../loadEnviroment.js";
import type { NextFunction, Request, Response } from "express";
import User from "../../../dataBase/models/User.js";
import bcrypt from "bcrypt";
import type { RegisterData } from "./types.js";
import CustomError from "../../../CustomError/CustomError.js";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (user)
      next(
        new CustomError("Email already exists", 400, "Email already exists")
      );

    const newUser = await User.create({
      username,
      password: hashPassword,
      email,
    });

    res.status(201).json({ user: { id: newUser, username, email } });
  } catch (error: unknown) {
    if ((error as Error).message.includes("username")) {
      next(
        new CustomError(
          (error as Error).message,
          409,
          "This username already exists"
        )
      );
      return;
    }

    if ((error as Error).message.includes("email")) {
      next(
        new CustomError(
          (error as Error).message,
          409,
          "This email already exists"
        )
      );
      return;
    }

    next(
      new CustomError((error as Error).message, 500, "Something went wrong")
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, username } = req.body as RegisterData;

  const user = await User.findOne({ username });

  if (!user) {
    next(new CustomError("Username not found", 401, "Wrong credentials"));
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    next(new CustomError("Password is incorrect", 401, "Wrong credentials"));
    return;
  }

  const tokenPlayload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(tokenPlayload, environment.jwtSecret, {
    expiresIn: "1d",
  });
  res.status(200).json({ token, username });
};
