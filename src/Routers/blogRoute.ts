import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createBlog, deleteBlog, getAllBlogs, getBlogByslug, getUserBlogs, updateBlog } from "../controllers/blogs";
const blogRouter:Router = Router();

blogRouter.post('/create',authMiddleware,createBlog);
blogRouter.put('/:slug',authMiddleware,updateBlog);
blogRouter.delete('/:slug',authMiddleware,deleteBlog);
blogRouter.get('/',getAllBlogs);
blogRouter.get('/:slug',getBlogByslug);
blogRouter.get('/blogs/:username',getUserBlogs)


export default blogRouter;