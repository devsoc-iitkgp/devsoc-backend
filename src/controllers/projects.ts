import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createProjectSchema, updateProjectSchema } from "../Validation/ZodValidation"; // Assuming validation file

const prismaClient = new PrismaClient();

const generateSlug = (projectName: string): string => {
    return projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const createProject = async (req: Request, res: Response) => {
    const userId = req.user.id;
    try {
        const parseResult = createProjectSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
            });
        }
        const { projectName, description, tags, capacity, thumbnail } = parseResult.data;
        const slug = generateSlug(projectName);
        const existingProject = await prismaClient.project.findFirst({
            where: {
                slug: slug,
            },
        });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: "A project with this name already exists for the user",
            });
        }
        const project = await prismaClient.project.create({
            data: {
                projectName,
                description,
                tags,
                capacity,
                thumbnail,
                ownerId: userId,
                slug,
            },
        });
        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (err) {
        console.error("Error while creating project:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const updateProject = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const slug = req.params.slug
    try {
        const body = req.body;
        const parseResult = updateProjectSchema.safeParse(body);
        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Error while validating inputs", 
            });
        }
        const project = await prismaClient.project.findUnique({
            where: { slug:slug },
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        if (project.ownerId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this project",
            });
        }
        let updatedData = parseResult.data;
        if (updatedData.projectName && updatedData.projectName !== project.projectName) {
            updatedData.slug = generateSlug(updatedData.projectName); // Add slug generation
        }
        const updatedProject = await prismaClient.project.update({
            where: { slug:slug },
            data: updatedData, 
        });
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject,
        });
    } catch (error) {
        console.error("Error while updating project details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const deleteProject = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const slug = req.params.slug; 
    try {
        const project = await prismaClient.project.findUnique({
            where: { slug: slug }, 
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        if (project.ownerId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this project",
            });
        }
        await prismaClient.project.delete({
            where: { slug: slug }, 
        });
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Error while deleting the Project", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const fetchAllProjects = async (req: Request, res: Response) => {
    try {
        const allProjects = await prismaClient.project.findMany(); 
        res.status(200).json({
            success: true,
            data: allProjects,
        });
    } catch (error) {
        console.error("Error fetching all projects:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getProjectBySlug = async (req:Request, res:Response) => {
    try {
        const slug = req.params.slug;
        const project = await prismaClient.project.findUnique({
            where: { slug: slug },
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (err) {
        console.error("Error fetching project by slug:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




export {createProject,updateProject,deleteProject,fetchAllProjects,getProjectBySlug}
