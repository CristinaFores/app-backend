import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import { generalError, unknownEndpoint } from "./middlewares/errors.js";
import userRouters from "./routers/userRouters.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use("/", userRouters);

app.use(unknownEndpoint);
app.use(generalError);
export default app;
