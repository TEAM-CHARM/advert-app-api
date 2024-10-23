import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";



const advertSchema = new Schema({
    title: { type: String, required: true },

    description: { type: String, required: true },

    imageUrl: { type: String,required:true }, 

    price: { type: Number, required: true },

    category: { type: String, required: true, enum: ["music", "business", "technology", "sports", "arts", "other"] },

    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    location: { type: String, required: true },

    date: { type: Date, required: true },

    expectedAttendees: { type: Number, required: true },    

    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});


advertSchema.plugin(toJSON);

export const Advert = model('Advert', advertSchema);