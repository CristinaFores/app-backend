import environment from "./loadEnviroment.js";
import debugCreator from "debug";
import startServer from "./server/startServer.js";
import chalk from "chalk";
import app from "./server/app.js";

const debug = debugCreator("item:server");

const { port } = environment;

await startServer(app, Number(port));
debug(chalk.green("Start server"));
