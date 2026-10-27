import mongoose from 'mongoose';

let isDbConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritechno', {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if offline
    });
    isDbConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`[WARNING] MongoDB local connection failed: ${error.message}`);
    console.info(`[INFO] AgriTechno starting with Smart In-Memory Store & Active Memory Fallback.`);
    console.info(`[INFO] Provide a valid MONGO_URI in backend/.env to persist into MongoDB Atlas.`);
  }
};

export const getDbStatus = () => isDbConnected;
