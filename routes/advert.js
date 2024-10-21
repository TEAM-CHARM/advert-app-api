import { Router } from "express";
import { createAdvert, deleteAdvert, getAdvert, getAllAdverts, updateAdvert } from "../controllers/advert.js";

export const advertRouter = Router();

advertRouter.post('/adverts', createAdvert);

advertRouter.get('/adverts', getAllAdverts);

advertRouter.get('/adverts/:id', getAdvert);

advertRouter.patch('/adverts/:id', updateAdvert);

advertRouter.delete('/adverts/:id', deleteAdvert);


export default advertRouter