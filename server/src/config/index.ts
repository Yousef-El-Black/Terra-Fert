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

const MYSQL_HOST = getRequiredVariable("MYSQL_HOST");
const MYSQL_USER = getRequiredVariable("MYSQL_USER");
const MYSQL_DATABASE = getRequiredVariable("MYSQL_DATABASE");
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD ?? "";
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
if (!Number.isInteger(MYSQL_PORT) || MYSQL_PORT < 1 || MYSQL_PORT > 65535) {
  throw new Error("MYSQL_PORT must be a valid TCP port.");
}
const JWT_SECRET = getRequiredVariable("JWT_SECRET");

export {
  PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  JWT_SECRET,
};
