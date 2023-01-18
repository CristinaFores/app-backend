import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middlewares/errors.js";
import userRouters from "./routers/userRouters.js";
import corsOptions from "./cors/corsOptions.js";

const app = express();

app.disable("x-powered-by");
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use("/", userRouters);

app.use(unknownEndpoint);
app.use(generalError);
export default app;
