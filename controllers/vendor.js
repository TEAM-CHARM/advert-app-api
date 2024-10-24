import { User } from "../models/user.js";
import { Advert } from "../models/advert.js";
import { updateAdvertValidator } from "../validators/advert.js";

export const vendorAds = async (req, res, next) => {
    try {
        const vendor = await User.findById(req.auth.id);
        console.log("vendor---->", vendor);

        const ads = await Advert.find({ organizer: vendor._id });
        res.status(200).json(ads);
    } catch (error) {
        next(error);
    }
}

export const updateVendorAd = async (req, res, next) => {
    try {
        const { error, value } = updateAdvertValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: 'Validation failed', details: error.details });
        }
        const updatedAd = await Advert.findByIdAndUpdate(req.params.id, value, { new: true });
        res.status(200).json(updatedAd);
    } catch (error) {
        next(error);
    }
}

export const deleteVendorAd = async (req, res, next) => {
    try {
        const addToDelete = await Advert.findById(req.params.id);
        console.log("addToDelete---->", addToDelete);
        //compare the ids of the addToDelete.organizer and req.auth.id
        if (addToDelete.organizer.toString() !== req.auth.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log("addToDelete---->", addToDelete);
        await Advert.findByIdAndDelete(addToDelete._id);
        res.status(200).json({ message: 'Advert deleted successfully' });
    } catch (error) {
        next(error);
    }
}