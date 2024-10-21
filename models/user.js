import { Schema, model } from "mongoose";


const userSchema = new Schema({
    name: { type: String,},

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, enum: ['vendor', 'user'] },

    bio: { type: String },

    profilePic: { type: String },
}, {
  toJSON: {
    versionKey: false, // exclude __v field
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
    }
  }
});

export const User = model('User', userSchema);