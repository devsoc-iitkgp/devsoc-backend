import { Request, Response } from "express";
import prismaClient from "../utils/prisma";
import {
  createBlogSchema,
  updateBlogSchema,
} from "../Validation/ZodValidation";

//use console.log(parseResult.error) in return json to find errors in input validation

const createBlog = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const body = req.body;
  try {
    const parseResult = createBlogSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: parseResult.error.issues,
      });
    }
    const { blogName, content, tagline, author, thumbnail, slug } =
      parseResult.data;
    const existingBlog = await prismaClient.blog.findFirst({
      where: {
        slug: slug,
      },
    });
    if (existingBlog) {
      return res.json({
        success: false,
        message: "A blog with this name already exists",
      });
    }
    const blog = await prismaClient.blog.create({
      data: {
        blogName,
        content,
        tagline,
        author,
        thumbnail,
        slug,
        ownerId: userId,
      },
    });
    res.status(201).json({
      success: true,
      data: blog,
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error("Cannot Create Blog", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const slug = req.params.slug;
    const parseResult = updateBlogSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Error while validating inputs",
        errors: parseResult.error.issues,
      });
    }
    const blog = await prismaClient.blog.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    if (blog.ownerId != userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this blog",
      });
    }
    let updatedData = parseResult.data;
    const updatedBlog = await prismaClient.blog.update({
      where: { slug: slug },
      data: updatedData,
    });
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error while updating Blog", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const slug = req.params.slug;
    const blog = await prismaClient.blog.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not Found",
      });
    }
    if (blog.ownerId != userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this blog",
      });
    }
    await prismaClient.blog.delete({
      where: {
        slug: slug,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Blog Deleted Succesfully",
    });
  } catch (error) {
    console.error("Unable to delete Blog", error);
    return res.status(500).json({
      success: false,
      message: "Intenal server error",
    });
  }
};

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const allBlogs = await prismaClient.blog.findMany();
    res.status(200).json({
      success: true,
      data: allBlogs,
    });
  } catch (error) {
    console.error("Error fetching all blogs", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getBlogByslug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const blog = await prismaClient.blog.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!blog) {
      return res.status(403).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    console.error("Error fetching Blog by slug:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserBlogs = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Username Not found",
      });
    }
    const userId = user.id;
    const blogs = await prismaClient.blog.findMany({
      where: {
        ownerId: userId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Blogs fetched succesfully",
      data: blogs,
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
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogByslug,
  getUserBlogs,
};
