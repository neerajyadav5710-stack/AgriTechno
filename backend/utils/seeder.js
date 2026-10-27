import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import SoilRecord from '../models/SoilRecord.js';
import Resource from '../models/Resource.js';
import Order from '../models/Order.js';
import PestAlert from '../models/PestAlert.js';
import Consultation from '../models/Consultation.js';
import ForumPost from '../models/ForumPost.js';
import { mockData } from '../data/mockStore.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritechno';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Farm.deleteMany({});
    await Crop.deleteMany({});
    await SoilRecord.deleteMany({});
    await Resource.deleteMany({});
    await Order.deleteMany({});
    await PestAlert.deleteMany({});
    await Consultation.deleteMany({});
    await ForumPost.deleteMany({});

    console.log(' Cleared old data.');

    // Seed mock data
    await User.insertMany(mockData.users);
    await Farm.insertMany(mockData.farms);
    await Crop.insertMany(mockData.crops);
    await SoilRecord.insertMany(mockData.soilRecords);
    await Resource.insertMany(mockData.resources);
    await Order.insertMany(mockData.orders);
    await PestAlert.insertMany(mockData.pestAlerts);
    await Consultation.insertMany(mockData.consultations);
    await ForumPost.insertMany(mockData.forumPosts);

    console.log(' AgriTechno database successfully seeded with all initial data!');
    process.exit(0);
  } catch (err) {
    console.error(` Seeding error: ${err.message}`);
    process.exit(1);
  }
};

seedData();
