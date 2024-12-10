import { Router } from "express";
import userRouter from "./userRoute";
import projectRouter from "./projectRoute";
const mainRouter:Router = Router();

mainRouter.use("/user",userRouter);
mainRouter.use("/projects",projectRouter);

export default mainRouter;