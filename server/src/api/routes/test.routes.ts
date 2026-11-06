import { Router, IRouter } from "express";
import {
  createTest,
  deleteTestById,
  getTestById,
  getTests,
  updateTestById,
} from "../../controllers/test.controller";
import { requireAdmin } from "../../middleware/adminAuth";

const testRoutes: IRouter = Router();

testRoutes.post("/", requireAdmin, createTest);

testRoutes.get("/", getTests);

testRoutes.get("/:id", getTestById);

testRoutes.put("/:id", requireAdmin, updateTestById);

testRoutes.delete("/:id", requireAdmin, deleteTestById);

export default testRoutes;
