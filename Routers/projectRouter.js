const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');

router.get('/', projectController.getProjects);

router.get('/:slug', projectController.getProjectBySlug);

router.post('/createProject', projectController.createProject);

router.put('/updateProject/:slug', projectController.updateProject);

router.delete('/deleteProject/:slug', projectController.deleteProject);

module.exports = router;
