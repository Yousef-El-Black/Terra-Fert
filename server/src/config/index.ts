import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(__dirname, "../../.env") });

const { PORT } = process.env;

const getRequiredVariable = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const MONGO_DB_URI = getRequiredVariable("MONGO_DB_URI");
const JWT_SECRET = getRequiredVariable("JWT_SECRET");

export { PORT, MONGO_DB_URI, JWT_SECRET };
