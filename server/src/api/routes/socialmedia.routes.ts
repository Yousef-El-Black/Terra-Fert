import { Router, IRouter } from "express";
import {
  createSocialMedia,
  deleteSocialMedia,
  getActiveSocialMedia,
  getAllSocialMedia,
  updateSocialMedia,
} from "../../controllers/socialmedia.controller";
import { requireSuperAdmin } from "../../middleware/adminAuth";

const socialMediaRoutes: IRouter = Router();

socialMediaRoutes.get("/", getActiveSocialMedia);
socialMediaRoutes.use(requireSuperAdmin);
socialMediaRoutes.get("/manage", getAllSocialMedia);
socialMediaRoutes.post("/", createSocialMedia);
socialMediaRoutes.put("/:id", updateSocialMedia);
socialMediaRoutes.delete("/:id", deleteSocialMedia);

export default socialMediaRoutes;
