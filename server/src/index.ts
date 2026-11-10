import express from "express";
import { MONGO_DB_URI, PORT } from "./config";
import mainRoutes from "./api";
import cors from "cors";
import { connectDB } from "./utils/connectDB";

// Define App
const app = express();

// Using CORS
app.use(cors());

// Define Port
const port = PORT || 3000;

// Connect Database
connectDB(MONGO_DB_URI);

// Parse JSON to Read Data from FrontEnd
app.use(express.json());

// API Routes
app.use("/api", mainRoutes);

// Launching App
app.listen(port, () => {
  console.log("App is Listening on Prot : " + port);
});
