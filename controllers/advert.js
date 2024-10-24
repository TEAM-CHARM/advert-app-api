import { Advert } from "../models/advert.js";
import bcrypt from "bcryptjs";
import { createAdvertValidator, updateAdvertValidator } from "../validators/advert.js";

export const createAdvert = async (req, res, next) => {
    try {
        // validate requet body //
        const { error, value } = createAdvertValidator.validate({
            ...req.body,
            imageUrl: req.file?.filename,

        });
        if (error) {
            return res.status(422).json(error);
        }
        // create advert to Databse//
        const advert = await Advert.create({
            ...value,
            user: req.auth.id
        })
        //Respond to request //
        res.status(201).json({ message: "Advert created successfully", advert });
    } catch (error) {
        console.log(error);
        next(error);
    }

};

export const getAllAdverts = async (req, res, next) => {
    try {
        const { filter = "{}", limit = 10, skip = 0 } = req.query;
        //Fetch Adverts from the database //
        const adverts = await Advert
            .find(JSON.parse(filter))
            .populate('organizer')
            .limit(limit)
            .skip(skip)
        //Return response //
        res.status(200).json(adverts);
    } catch (error) {
        next(error);
    }
}

export const getAdvert = async (req, res, next) => {
    try {
        // fetch advert from the database 
        const advert = await Advert.findById(req.params.id).populate('organizer');
        if (!advert) {
            return res.status(404).json({ error: 'Advert not found' });
        }
        res.json(advert);
    } catch (error) {
        next(error);
    }
}

export const updateAdvert = async (req, res, next) => {
    try {
        const { error, value } = updateAdvertValidator.validate(
            {

                ...req.body,
                imageUrl: req.file?.filename,

            }
        );
        if (error) {
            return res.status(422).json({ error: 'Validation failed', details: error });
        }
        console.log(req.params, req.auth)

        const advert = await Advert.findOneAndUpdate({
            _id: req.params.id,
            user: req.auth.id
        },
            value, { new: true }
        );
        if (!advert) {
            return res.status(404).json({ error: 'Advert not found' });
        }
        res.json({ message: 'Advert updated successfully', });
    } catch (error) {
        next(error);
    }
}

export const deleteAdvert = async (req, res, next) => {
    try {
        const advert = await Advert.findOneAndDelete({
            _id: req.params.id,
            organizer: req.auth.id

        })
        if (!advert) {
            return res.status(404).json({ error: 'Advert not found' });
        }
        res.json({ message: 'Advert deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const getSummary = async (req, res, next) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Fetch trending adverts (randomly pick 10 adverts)
        const trendingAdverts = await Advert.aggregate([{ $sample: { size: 10 } }]);

        // Fetch upcoming adverts
        const upcomingAdverts = await Advert.aggregate([
            { $match: { date: { $gte: new Date() } } },
            { $sort: { date: 1 } },
            { $limit: 10 }
        ]);

        // Fetch today's adverts
        const todaysAdverts = await Advert.aggregate([
            { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
            { $sort: { date: -1 } },
            { $limit: 10 }
        ]);

        // Apply toJSON-like transformation manually
        const transformAdvert = (advert) => {
            // Remove unwanted fields
            const { _id, __v, ...rest } = advert;
            return {
                ...rest,
                id: _id // Rename _id to id, as an example
            };
        };

        // Transform each advert result
        const transformedTrendingAdverts = trendingAdverts.map(transformAdvert);
        const transformedUpcomingAdverts = upcomingAdverts.map(transformAdvert);
        const transformedTodaysAdverts = todaysAdverts.map(transformAdvert);

        // Return the transformed results
        res.status(200).json({
            trending: transformedTrendingAdverts,
            upcoming: transformedUpcomingAdverts,
            today: transformedTodaysAdverts
        });
    } catch (error) {
        next(error);
    }
};

