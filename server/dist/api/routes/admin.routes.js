"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../../controllers/admin.controller");
const adminAuth_1 = require("../../middleware/adminAuth");
const adminRoutes = (0, express_1.Router)();
adminRoutes.post("/login", admin_controller_1.loginAdmin);
adminRoutes.get("/setup-status", admin_controller_1.getAdminSetupStatus);
adminRoutes.post("/register-super-admin", admin_controller_1.registerInitialSuperAdmin);
adminRoutes.get("/me", adminAuth_1.requireAdmin, (_req, res) => {
    return res.status(200).json(res.locals.admin);
});
adminRoutes.post("/", adminAuth_1.requireSuperAdmin, admin_controller_1.createAdmin);
adminRoutes.get("/", adminAuth_1.requireSuperAdmin, admin_controller_1.getAdmins);
adminRoutes.get("/:id", adminAuth_1.requireSuperAdmin, admin_controller_1.getAdminById);
adminRoutes.put("/:id", adminAuth_1.requireSuperAdmin, admin_controller_1.updateAdminById);
adminRoutes.delete("/:id", adminAuth_1.requireSuperAdmin, admin_controller_1.deleteAdminById);
exports.default = adminRoutes;
