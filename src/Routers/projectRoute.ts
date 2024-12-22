import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectBySlug,
  getUserProjects,
  updateProject,
} from "../controllers/projects";
import { authMiddleware } from "../middlewares/auth";

const projectRouter: Router = Router();
projectRouter.post("/create", authMiddleware, createProject);
projectRouter.put("/:slug", authMiddleware, updateProject);
projectRouter.delete("/:slug", authMiddleware, deleteProject);
projectRouter.get("/", getAllProjects);
projectRouter.get("/:username/:slug", getProjectBySlug);
projectRouter.get("/:username", getUserProjects);

export default projectRouter;
