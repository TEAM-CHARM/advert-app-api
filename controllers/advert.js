import { Advert } from "../models/advert.js";

const createAdvert = async (req, res, next) => {
    try {
        const { title, description, category, price } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        try {
            const advert = new Advert({
                title,
                description,
                category,
                price,
                imageUrl,
                vendor: req.user.id
            });
            await advert.save();
            res.status(201).json(advert);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllAdverts = async (req, res, next) => {
    try {
        const books = await Advert.find();
        res.status(200).json(adverts);
    } catch (error) {
        next(error);
    }
};

// Update an advert
const updateAdvert = async (req, res, next) => {
    const { id } = req.params;
    const advert = await Advert.findById(id);

    if (!advert) return res.status(404).json({ error: 'Advert not found' });

    if (advert.vendor.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    try {
        const updatedAdvert = await Advert.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedAdvert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an advert
const deleteAdvert = async (req, res) => {
    const { id } = req.params;
    const advert = await Advert.findById(id);

    if (!advert) return res.status(404).json({ error: 'Advert not found' });

    if (advert.vendor.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    try {
        await advert.remove();
        res.json({ message: 'Advert removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


