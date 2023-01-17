import express from "express";
import { validate } from "express-validation";
import { register } from "../controllers/users/users.js";
import registerUserSchema from "../schemas/registerUserSchema.js";

const userRouters = express.Router();
userRouters.post(
  "/register",
  validate(registerUserSchema, {}, { abortEarly: false }),
  register
);

export default userRouters;
