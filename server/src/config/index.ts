import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: "../.env" });
dotenv.config({ path: "../../.env" });
dotenv.config({ path: "./.env" });
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.prod" });
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.dev" });
dotenv.config({ path: ".env.prev" });

export const { PORT, MONGO_DB_URI, JWT_SECRET } = process.env;
