import express, { Router, IRouter } from "express";
import productRoutes from "./routes/product.routes";
import uploadRoutes, { uploadDir } from "./routes/upload.routes";
import testRoutes from "./routes/test.routes";
import adminRoutes from "./routes/admin.routes";
import socialMediaRoutes from "./routes/socialmedia.routes";

// Define The Main Route
const mainRoutes: IRouter = Router();

mainRoutes.use("/uploads", express.static(uploadDir));

mainRoutes.use("/upload", uploadRoutes);

mainRoutes.use("/products", productRoutes);

mainRoutes.use("/tests", testRoutes);

mainRoutes.use("/admins", adminRoutes);

mainRoutes.use("/social", socialMediaRoutes);

mainRoutes.post("/", (req, res) => {
  try {
    res.json(req.body);
  } catch (error) {
    res.send(error);
  }
});

export default mainRoutes;
