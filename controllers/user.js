import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { createUserValidator, loginUserValidator, updateUserValidator } from "../validators/user.js";


//Function to send SMS
const sendSMS =async (businessName,businessPhone)=>{
  const clientId = process.env.clientID;
  const clientSecret = process.env.clientSecret;
  const from = process.env.senderID;
  const content = `
Welcome to Evently, ${businessName}!\n
Thank you for joining Evently, Now you can connect with thousands of customers in just a few clicks.\n
We're excited to help you grow and succeed in the world of event promotion!
— The Evently Team
  `;
   const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${clientId}&clientsecret=${clientSecret}&from=${from}&to=${businessPhone}&content=${encodeURIComponent(
     content
   )}`;
    try {
      const response = await axios.get(url);
      console.log("SMS Response:", response.data); // Log the response for debugging
    } catch (error) {
      console.error("Error sending SMS:", error);
    }

}

export const createUser = async (req, res, next) => {
  const { error, value } = createUserValidator.validate(req.body);

  if (error) {
    return res.status(422).json({ error: "Validation Failed", details: error.details });
  }

  const { name, email, password,businessName, businessPhone, ...rest } = value;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      businessName, // Store business name
      businessPhone,
      ...rest,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // Send SMS to the vendor after successful signup
    if (businessPhone && businessName) {
      await sendSMS(businessName, businessPhone);
    }
    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};


export const loginUser = async (req, res, next) => {
  const { error, value } = loginUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json({ error: 'Validation failed', details: error.details });
  }
  const { email, password } = value;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const response = {
      token,
      user
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const user = await User
      .findById(req.auth.id)
      .select({ password: false });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateUserValidator.validate({
      ...req.body,
      avatar: req.file?.filename
    });

    if (error) {
      return res.status(422).json({ error: 'Validation failed', details: error.details });
    }

const user = await User.findById(req.auth.id);

    // Check if the user is updating to become a vendor
    const isBecomingVendor = user.role !== "vendor" && value.role === "vendor";
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(req.auth.id, value, { new: true });


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
     // Send SMS only if the user has become a vendor
    if (isBecomingVendor && updatedUser.businessPhone && updatedUser.businessName) {
      await sendSMS(updatedUser.businessName, updatedUser.businessPhone);
    }
    const response = {
      token,
      user
    };
    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};

export const followVendor = async (req, res, next) => {
  const followerId = req.auth.id;
  const vendorId = req.body.vendorId;
  try {
    const vendor = await User.findOneAndUpdate(vendorId, ); //find the vendor to be followed

    // check if the user is already following the vendor
    const isFollowing = await User.findOne({
      $and: [
        { $or: [{ followers: followerId }, ] },
        // { $or: [{ followers: vendorId },] },
      ],
    });

    if (isFollowing) {
      // remove the user from the following list of the vendor
      const updatedUser = await User.findOneAndUpdate(
        { _id: followerId },
        { $pull: { following: vendorId } },
        { new: true }
      )

      // remove the vendor from the followers list of the user
      const updatedVendor = await User.findOneAndUpdate(
        { _id: vendorId },
        { $pull: { followers: followerId } },
        { new: true }
      );
      return res.status(200).json({ updatedUser, updatedVendor });
    }

    // add the user to the following list of the vendor
    const updatedUser = await User.findOneAndUpdate(
      { _id: followerId },
      { $push: { following: vendorId } },
      { new: true }
    );

    // add the vendor to the followers list of the user 
    const updatedVendor = await User.findOneAndUpdate(
      { _id: vendorId },
      { $push: { followers: followerId } },
      { new: true }
    );
    res.status(200).json({ updatedUser, updatedVendor });
  } catch (error) {
    next(error);
  }
  
}


export const logoutUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const blackListedToken = await BlackList.create({ token });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}