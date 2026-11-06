import { Router, IRouter } from "express";
import {
  countProducts,
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../../controllers/product.controller";
import { requireAdmin } from "../../middleware/adminAuth";

const productRoutes: IRouter = Router();

productRoutes.post("/", requireAdmin, createProduct);

productRoutes.get("/count", countProducts);

productRoutes.get("/:id", getProductById);

productRoutes.delete("/:id", requireAdmin, deleteProductById);

productRoutes.put("/:id", requireAdmin, updateProductById);

productRoutes.get("/", getProducts);

export default productRoutes;
