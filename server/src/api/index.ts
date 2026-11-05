import express, { Router, IRouter } from "express";
import productRoutes from "./routes/product.routes";
import uploadRoutes, { uploadDir } from "./routes/upload.routes";

// Define The Main Route
const mainRoutes: IRouter = Router();

mainRoutes.use("/uploads", express.static(uploadDir));

mainRoutes.use("/upload", uploadRoutes);

mainRoutes.use("/products", productRoutes);

mainRoutes.post("/", (req, res) => {
  try {
    res.json(req.body);
  } catch (error) {
    res.send(error);
  }
});

export default mainRoutes;
