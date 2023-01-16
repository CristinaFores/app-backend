import environment from "./loadEnviroment.js";
import debugCreator from "debug";
import startServer from "./server/startServer.js";
import chalk from "chalk";
import app from "./server/app.js";
import { connectDb } from "./dataBase/index.js";

const debug = debugCreator("item:server");

const { port, mongoDbUrl } = environment;

await startServer(app, Number(port));
debug(chalk.green("Start server"));
await connectDb(mongoDbUrl);
debug(chalk.magenta("Connect data base"));
