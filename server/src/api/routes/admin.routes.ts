import { Router, IRouter } from "express";
import {
  createAdmin,
  deleteAdminById,
  getAdminSetupStatus,
  getAdminById,
  getAdmins,
  loginAdmin,
  registerInitialSuperAdmin,
  updateAdminById,
} from "../../controllers/admin.controller";
import { requireAdmin, requireSuperAdmin } from "../../middleware/adminAuth";

const adminRoutes: IRouter = Router();

adminRoutes.post("/login", loginAdmin);
adminRoutes.get("/setup-status", getAdminSetupStatus);
adminRoutes.post("/register-super-admin", registerInitialSuperAdmin);

adminRoutes.get("/me", requireAdmin, (_req, res) => {
  return res.status(200).json(res.locals.admin);
});

adminRoutes.use(requireSuperAdmin);
adminRoutes.post("/", createAdmin);
adminRoutes.get("/", getAdmins);
adminRoutes.get("/:id", getAdminById);
adminRoutes.put("/:id", updateAdminById);
adminRoutes.delete("/:id", deleteAdminById);

export default adminRoutes;
