import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI; 

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB : ", error.message);
    }
}

export default connectDB;