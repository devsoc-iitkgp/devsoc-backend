import { Router } from "express";
import { addBookmark, fetchUserDetails, removeBookmark, signin, signup, userUpdate } from "../controllers/user";
import { authMiddleware } from "../middlewares/auth";


const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin',signin);
userRouter.get('/',authMiddleware, fetchUserDetails);
userRouter.put('/',authMiddleware,userUpdate);
userRouter.put('/add-bookmark',authMiddleware,addBookmark);
userRouter.put('/remove-bookmark',authMiddleware,removeBookmark);

export default userRouter;

