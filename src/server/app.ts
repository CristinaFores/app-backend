import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import { validate } from "express-validation";
import { register } from "./controllers/users/users.js";
import registerUserSchema from "./schemas/registerUserSchema.js";
import { generalError, unknownEndpoint } from "./middlewares/errors.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.post(
  "/register",
  validate(registerUserSchema, {}, { abortEarly: false }),
  register
);

app.use(unknownEndpoint);
app.use(generalError);
export default app;
