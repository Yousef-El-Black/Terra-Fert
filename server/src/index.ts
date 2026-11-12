import express from "express";
import { PORT } from "./config";
import mainRoutes from "./api";
import cors from "cors";
import { connectDB } from "./utils/connectDB";

// Define App
const app = express();

// Using CORS
app.use(cors());

// Define Port
const port = PORT || 3000;

// Parse JSON to Read Data from FrontEnd
app.use(express.json());

// API Routes
app.use("/api", mainRoutes);

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log("App is Listening on Port : " + port);
  });
};

void start().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
