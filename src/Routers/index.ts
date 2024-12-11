import { Router } from "express";
import userRouter from "./userRoute";
import projectRouter from "./projectRoute";
import blogRouter from "./blogRoute";
const mainRouter:Router = Router();

mainRouter.use("/user",userRouter);
mainRouter.use("/projects",projectRouter);
mainRouter.use('/blogs',blogRouter);

export default mainRouter;