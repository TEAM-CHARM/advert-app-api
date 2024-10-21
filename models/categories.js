import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

export const Category = model('Category', categorySchema)