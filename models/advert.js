import { Schema, model } from "mongoose";

const advertSchema = new Schema({
    title: { type: String, required: true },

    description: { type: String },

    category: { type: String },

    price: { type: Number },

    imageUrl: { type: String },

    vendor: { type:Schema.Types.ObjectId, ref: 'User' }
});


export const Advert = model('Advert', advertSchema);