import { Router } from "express";
import { createAdvert, deleteAdvert, getAdvert, getAllAdverts, updateAdvert, getSummary } from "../controllers/advert.js";
import { advertIconUpload } from "../middleware/upload.js";
import { hasPermission, isAuthenticated } from "../middleware/auth.js";

export const advertRouter = Router();

advertRouter.post('/adverts', isAuthenticated, hasPermission("create_advert"), advertIconUpload.single('imageUrl'), createAdvert);

advertRouter.get('/adverts', getAllAdverts);

advertRouter.get('/adverts/:id', getAdvert);

advertRouter.patch('/adverts/:id', updateAdvert);

advertRouter.delete('/adverts/:id', deleteAdvert);

advertRouter.get('/adverts-summary', getSummary)



export default advertRouter