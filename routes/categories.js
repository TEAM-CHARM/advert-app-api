import { Router } from "express";
import { getAllCategories } from "../controllers/categories.js";


export const categoryRouter = Router();

categoryRouter.get('/categories', getAllCategories);

export default categoryRouter
