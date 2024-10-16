import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.js";


export const userRouter = Router();
userRouter.post('/user', createUser);

userRouter.post('/login', loginUser);