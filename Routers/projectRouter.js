const express = require('express');
const projectsRouter = express.Router();

const { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } = require('../Controllers/projects');

projectsRouter.get('/', getProjects);
projectsRouter.get('/:slug', getProjectBySlug);
projectsRouter.post('/createProject', createProject);
projectsRouter.put('/updateProject/:slug', updateProject);
projectsRouter.delete('/deleteProject/:slug', deleteProject);

module.exports = projectsRouter;
