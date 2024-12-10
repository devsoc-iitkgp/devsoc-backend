import { Router } from "express";
import { createProject, deleteProject, fetchAllProjects, getProjectBySlug, updateProject } from "../controllers/projects";
import { authMiddleware } from "../middlewares/auth";

const projectRouter:Router = Router();
projectRouter.post('/createproject', authMiddleware, createProject);
projectRouter.put('/updateproject/:slug',authMiddleware,updateProject);
projectRouter.delete('/deleteproject/:slug',authMiddleware,deleteProject);
projectRouter.get('/',fetchAllProjects);
projectRouter.get('/:slug',getProjectBySlug);

export default projectRouter;