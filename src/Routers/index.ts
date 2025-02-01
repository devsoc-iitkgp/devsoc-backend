import { Router } from "express";
import userRouter from "./userRoute";
import projectRouter from "./projectRoute";
import blogRouter from "./blogRoute";
import { signin, signup } from "../controllers/user";
const mainRouter:Router = Router();

mainRouter.use("/user",userRouter);
mainRouter.use("/projects",projectRouter);
mainRouter.use('/blogs',blogRouter);
mainRouter.use('/signup',signup);
mainRouter.use('/signin',signin);

export default mainRouter;