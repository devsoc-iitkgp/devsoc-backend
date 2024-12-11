import { Router } from "express";
import { addBookmark, fetchUserDetails, removeBookmark, sendRequest, signin, signup, userUpdate } from "../controllers/user";
import { authMiddleware } from "../middlewares/auth";


const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin',signin);
userRouter.get('/',authMiddleware, fetchUserDetails);
userRouter.put('/',authMiddleware,userUpdate);
userRouter.post('/add-bookmark',authMiddleware,addBookmark);
userRouter.delete('/remove-bookmark',authMiddleware,removeBookmark);
userRouter.post('/send-request',authMiddleware,sendRequest);

export default userRouter;

