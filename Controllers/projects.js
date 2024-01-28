const Project = require('../Schema/projectSchema.js');

const getProjects = async (req, res) => {
    try {
        const project = await Project.find().exec();
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(404).json({ sucess: false, error: err });
    }
}

const getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug }).exec();
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(404).json({ sucess: false, error: err });
    }
}

const createProject = async (req, res) => {
    try {
        const project = Project(req.body);
        await project.save();
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ sucess: false, error: err });
    }
}

const updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true }).exec();
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ sucess: false, error: err });
    }
}

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ slug: req.params.slug }).exec();
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ sucess: false, error: err });
    }
}

module.exports = { getProjects, getProjectBySlug, createProject, updateProject, deleteProject };