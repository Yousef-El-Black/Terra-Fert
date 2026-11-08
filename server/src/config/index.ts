import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: "../.env" });
dotenv.config({ path: "../../.env" });
dotenv.config({ path: "./.env" });
dotenv.config({ path: ".env" });

export const { PORT, MONGO_DB_URI, JWT_SECRET } = process.env;
