import dotenv from "dotenv";

dotenv.config();

const enviroment = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
};

export default enviroment;
