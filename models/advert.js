import { Schema, model } from "mongoose";

const advertSchema = new Schema({
    title: { type: String, required: true },

    description: { type: String, required: true },

    imageURL: { type: String }, 

    price: { type: Number, required: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 

    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 

    location: { type: String, required: true },

    date: { type: Date, required: true },

    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});



export const Advert = model('Advert', advertSchema);