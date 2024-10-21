import { Advert } from "../models/advert.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAdvertValidator, updateAdvertValidator } from "../validators/advert.js";

export const createAdvert = async (req, res, next) => {
    try {
      const { error, value } = createAdvertValidator.validate(req.body);
      if (error) {
        return res.status(422).json({ error: 'Validation failed', details: error });
      }
  
      const advert = await Advert.findOne({ title: value.title });
      if (advert) {
        return res.status(409).json({ error: 'Advert with this title already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(value.password, 10);
      const createdAdvert = await Advert.create({
        ...value,
        password: hashedPassword
      });
  
      res.json({ message: 'Advert created successfully', data: createdAdvert });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

    export const getAllAdverts = async (req, res, next) => {
       try {
        const adverts = await Advert
        .find(JSON.parse(filter))
        .limit(limit)
        .skip(skip)
         res.status(200).json(adverts);
       } catch (error) {
        next(error);
       }
    }

    export const getAdvert = async (req, res, next) => {
        try {
            const advert = await Advert.findById(req.params.id);
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
            const { error, value } = updateAdvertValidator.validate(req.body);
            if (error) {
                return res.status(422).json({ error: 'Validation failed', details: error });
            }
            const advert = await Advert.findOne({ title: value.title });
            if (!advert) {
                return res.status(404).json({ error: 'Advert not found' });
            }
            const updatedAdvert = await Advert.findByIdAndUpdate(advert._id, value, { new: true });
            res.json({ message: 'Advert updated successfully', data: updatedAdvert });
        } catch (error) {
            next(error);
        }
    }

    export const deleteAdvert = async (req, res, next) => {
        try {
            const advert = await Advert.findByIdAndDelete(req.params.id);
            if (!advert) {
                return res.status(404).json({ error: 'Advert not found' });
            }
            res.json({ message: 'Advert deleted successfully' });
        } catch (error) {
            next(error);
        }
    }