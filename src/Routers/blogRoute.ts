import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createBlog, deleteBlog, getAllBlogs, getBlogByslug, getMyBlogs, getUserBlogs, updateBlog } from "../controllers/blogs";
const blogRouter:Router = Router();

blogRouter.post('/create',authMiddleware,createBlog);
blogRouter.put('/update/:slug',authMiddleware,updateBlog);
blogRouter.delete('/delete/:slug',authMiddleware,deleteBlog);
blogRouter.get('/',getAllBlogs);
blogRouter.get('/myblogs',authMiddleware,getMyBlogs);
blogRouter.get('/:slug',getBlogByslug);
blogRouter.get('/userblogs/:username',getUserBlogs);

export default blogRouter;