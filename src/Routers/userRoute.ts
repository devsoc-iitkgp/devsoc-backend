import { Router } from "express";
import { addBookmark, fetchUserDetails, removeBookmark, sendRequest, userUpdate } from "../controllers/user";
import { authMiddleware } from "../middlewares/auth";


const userRouter = Router();

userRouter.get('/',authMiddleware, fetchUserDetails);
userRouter.put('/',authMiddleware,userUpdate);
userRouter.post('/bookmark',authMiddleware,addBookmark);
userRouter.delete('/bookmark',authMiddleware,removeBookmark);
userRouter.post('/send-request',authMiddleware,sendRequest);

export default userRouter;

