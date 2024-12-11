import { Router } from "express";
import { createProject, deleteProject, getAllProjects, getMyProjects, getProjectBySlug, getUserProjects, updateProject } from "../controllers/projects";
import { authMiddleware } from "../middlewares/auth";

const projectRouter:Router = Router();
projectRouter.post('/create', authMiddleware, createProject);
projectRouter.put('/update/:slug',authMiddleware,updateProject);
projectRouter.delete('/delete/:slug',authMiddleware,deleteProject);
projectRouter.get('/myprojects',authMiddleware,getMyProjects);
projectRouter.get('/',getAllProjects);
projectRouter.get('/:slug',getProjectBySlug);
projectRouter.get('/userprojects/:username',getUserProjects);

export default projectRouter;