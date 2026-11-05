import { Router, IRouter } from "express";
import {
  countProducts,
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../../controllers/product.controller";

const productRoutes: IRouter = Router();

productRoutes.post("/", createProduct);

productRoutes.get("/count", countProducts);

productRoutes.get("/:id", getProductById);

productRoutes.delete("/:id", deleteProductById);

productRoutes.put("/:id", updateProductById);

productRoutes.get("/", getProducts);

export default productRoutes;
