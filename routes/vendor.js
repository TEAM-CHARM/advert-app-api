import { Router } from "express";
import { hasPermission, isAuthenticated } from "../middleware/auth.js";
import { deleteVendorAd, updateVendorAd, vendorAds } from "../controllers/vendor.js";

export const vendorRouter = Router();

vendorRouter.get('/vendor-ads', isAuthenticated ,vendorAds);

vendorRouter.patch('/vendor-ads/:id', isAuthenticated, hasPermission('update_advert') ,updateVendorAd);

vendorRouter.delete('/vendor-ads/:id', isAuthenticated, hasPermission('delete_advert') ,deleteVendorAd);



export default vendorRouter