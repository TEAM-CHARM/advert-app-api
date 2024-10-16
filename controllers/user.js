import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
    const { email, password } = req.body;

    if ( !email || !password ) {
        return res.status(422).json({message: "Please add all fields"});
    }

   try {
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(409).json({message: "User with this email already exists"});
    }
     const hashedPassword = await bcrypt.hash(password, 10);

     const newUser = new User({
        email,
        password: hashedPassword,
     });

     const user = await newUser.save();
     res.status(201).json(user);
   } catch (error) {
    next(error);
   }
};





export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: "Please add all fields" });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const response = {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }