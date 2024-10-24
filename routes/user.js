import { Router } from "express";
import { createUser, followVendor, getProfile, loginUser, logoutUser, updateProfile } from "../controllers/user.js";
import { hasPermission, isAuthenticated } from "../middleware/auth.js";


export const userRouter = Router();
userRouter.post('/register', createUser);

userRouter.post('/login', loginUser);

userRouter.get('/users/me', isAuthenticated, getProfile);

userRouter.post('/logout', isAuthenticated, logoutUser);

userRouter.patch('/users/me', isAuthenticated, hasPermission('update_profile'), updateProfile);

userRouter.patch('/follow', isAuthenticated ,followVendor)


export default userRouter