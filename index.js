import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import { toJSON } from '@reis/mongoose-to-json';
import { userRouter } from './routes/user.js';
import { categoryRouter } from './routes/categories.js';
import { advertRouter } from './routes/advert.js';
import { vendorRouter } from './routes/vendor.js';


await mongoose.connect(process.env.MONGO_URI).then(() => console.log("Database connected successfully")).catch((error) => console.log("Error connecting to database", error));

const app = express();
const port = process.env.PORT ||
    3000

app.use(express.json())

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(categoryRouter);
app.use(advertRouter);
app.use(vendorRouter);


mongoose.plugin(toJSON);


app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});