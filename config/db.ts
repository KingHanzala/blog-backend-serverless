'use server'

const mongoose = require('mongoose');
import dotenv from 'dotenv';

dotenv.config();

const uri: string = process.env.MONGO_KEY as string;

export default async function dbConnect() {
    await mongoose.connect(String(process.env.MONGO_KEY));
    console.log('Connected to MongoDB');
}
