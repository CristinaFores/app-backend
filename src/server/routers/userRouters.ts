import express from "express";
import { validate } from "express-validation";
import { login, register } from "../controllers/users/users.js";
import loginUserSchema from "../schemas/loginUserSchema.js";
import registerUserSchema from "../schemas/registerUserSchema.js";

const userRouters = express.Router();

userRouters.post(
  "/register",
  validate(registerUserSchema, {}, { abortEarly: false }),
  register
);

userRouters.post(
  "/login",
  validate(loginUserSchema, {}, { abortEarly: false }),
  login
);

export default userRouters;
