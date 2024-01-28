const express = require("express")
const { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require("../Controllers/blogs")

const blogsRouter = express.Router()

blogsRouter.get("/", getBlogs)
blogsRouter.get("/:slug", getBlogBySlug)
blogsRouter.post("/createBlog",createBlog)
blogsRouter.patch("/updateBlog", updateBlog)
blogsRouter.delete("/deleteBlog", deleteBlog)


module.exports = blogsRouter