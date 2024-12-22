import { Request, Response } from "express";
import prismaClient from "../utils/prisma";
import { projectSchema } from "../Validation/ZodValidation"; // Assuming validation file

const createProject = async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const parseResult = projectSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues,
      });
    }
    const { projectName, description, tags, capacity, thumbnail, slug } =
      parseResult.data;
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
  const slug = req.params.slug;
  try {
    const body = req.body;
    const parseResult = projectSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Error while validating inputs",
        errors: parseResult.error.issues,
      });
    }
    const project = await prismaClient.project.findUnique({
      where: {
        ownerId: userId,
        slug: slug,
      },
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    let updatedData = parseResult.data;
    const updatedProject = await prismaClient.project.update({
      where: { slug: slug },
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
};

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
      where: {
        ownerId: userId,
        slug: slug,
      },
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

const getAllProjects = async (req: Request, res: Response) => {
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

const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const slug = req.params.slug;
    if (!username || !slug) {
      return res.status(400).json({
        success: false,
        message: "Username and project are required",
      });
    }
    const project = await prismaClient.project.findUnique({
      where: {
        slug: slug,
        owner: {
          username: username,
        },
      },
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

const getUserProjects = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await prismaClient.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username not found",
      });
    }
    const userId = user.id;
    const projects = await prismaClient.project.findMany({
      where: {
        ownerId: userId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectBySlug,
  getUserProjects,
};
