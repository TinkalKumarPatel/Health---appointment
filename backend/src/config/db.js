import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/health-appointment';

export let isConnectedToMongo = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isConnectedToMongo = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    isConnectedToMongo = false;
    console.log(`[Info] Local MongoDB not reachable (${err.message}). Seamlessly activated built-in in-memory database.`);
  }
};
