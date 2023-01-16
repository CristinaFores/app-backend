import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import { validate } from "express-validation";
import { register } from "./controllers/users/users.js";
import registerUserSchema from "./schemas/registerUserSchema.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.post(
  "/users",
  validate(registerUserSchema, {}, { abortEarly: false }),
  register
);
export default app;
