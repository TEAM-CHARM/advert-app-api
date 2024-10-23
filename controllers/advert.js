import { Advert } from "../models/advert.js";
import bcrypt from "bcryptjs";
import { createAdvertValidator, updateAdvertValidator } from "../validators/advert.js";

export const createAdvert = async (req, res, next) => {
    try {
        // validate requet body //
        const{error,value}=createAdvert.validate({
            ...req.body,
            imageUrl:file?.filename,

        });
        if(error){
              return res.status(422).json(error);
        }
        // create advert to Databse//
        await  Advert.create({
            ...value,
            user:req.auth.id
        })
        //Respond to request //
        res.status(201).json({message:"Advert created successfully"});
    } catch (error) {
        next(error);
    }
};

    export const getAllAdverts = async (req, res, next) => {
       try {
        const {filter="{}",limit =10,skip =0}=req.query;
        //Fetch Adverts from the database //
        const adverts = await Advert
        .find(JSON.parse(filter))
        .limit(limit)
        .skip(skip)
        //Retunn response //
         res.status(200).json(adverts);
       } catch (error) {
        next(error);
    }
}

    export const getAdvert = async (req, res, next) => {
        try {
            // fetch advert from the database 
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
            const { error, value } = updateAdvertValidator.validate(
                {

                    ...req.body,
                    imageUrl:req.file?.filename,

                }
            );
            if (error) {
                return res.status(422).json({ error: 'Validation failed', details: error });
            }
            console.log(req.params,req.auth)

            const advert = await Advert.findOneAndUpdate({ 
                _id:req.params.id,
                user:req.auth.id
            },
            value,{new:true}
        );
            if (!advert) {
                return res.status(404).json({ error: 'Advert not found' });
            }
            res.json({ message: 'Advert updated successfully',});
        } catch (error) {
            next(error);
        }
    }

    export const deleteAdvert = async (req, res, next) => {
        try {
            const advert = await Advert.findOneAndDelete({
                _id:req.params.id,
                user:req.auth.id

            })
            if (!advert) {
                return res.status(404).json({ error: 'Advert not found' });
            }
            res.json({ message: 'Advert deleted successfully' });
        } catch (error) {
            next(error);
        }
    }