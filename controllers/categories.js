import { Category } from "../models/categories.js";
import bcrypt from "bcryptjs";



// export const createCategory = async (req, res, next) => {
//     try {
//         const { error, value } = createCategoryValidator.validate(req.body);
//         if (error) {
//             return res.status(422).json({ error: 'Validation failed', details: error.details });
//         }

//         const category = await Category.findOne({ name: value.name });
//         if (category) {
//             return res.status(409).json({ error: 'Category with this name already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(value.password, 10);
//         const createdCategory = await Category.create({
//             ...value,
//             password: hashedPassword
//         });

//         res.json({ message: 'Category created successfully', data: createdCategory });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};