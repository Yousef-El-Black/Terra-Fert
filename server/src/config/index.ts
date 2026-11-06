import dotenv from "dotenv";

dotenv.config();

export const { PORT, MONGO_DB_URI, JWT_SECRET } = process.env;
