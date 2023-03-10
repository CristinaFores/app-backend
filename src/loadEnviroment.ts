import dotenv from "dotenv";

dotenv.config();

const enviroment = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  supabaseKey: process.env.SUPABASE_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET_ID,
  supabaseUrl: process.env.SUPABASE_URL,
};

export default enviroment;
