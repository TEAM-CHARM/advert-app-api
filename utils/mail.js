import { createTransport } from "nodemailer";

export const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'charlotteseyab19@gmail.com',
        pass: 'gepudqxhybcydenx '
    }
    });