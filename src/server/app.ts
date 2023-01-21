import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middlewares/errors/errors.js";
import userRouters from "./routers/userRouters/userRouters.js";
import corsOptions from "./cors/corsOptions.js";
import notesRouters from "./routers/notesRouters,ts/notesRouters.js";
import { auth } from "./middlewares/auth/auth.js";

const app = express();

app.disable("x-powered-by");
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use("/", userRouters);
app.use("/", auth, notesRouters);

app.use(unknownEndpoint);
app.use(generalError);
export default app;
