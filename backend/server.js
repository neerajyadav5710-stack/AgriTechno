import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import soilRoutes from './routes/soilRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import pestRoutes from './routes/pestRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'AgriTechno API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pest-alerts', pestRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(` AgriTechno Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
