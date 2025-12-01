import express from 'express';
import { SERVICES } from '../config/services.js';
import authRoutes from './authRoutes.js';
import businessRoutes from './businessRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

// Info del API
router.get('/', (req, res) => {
  res.json({
    message: 'Localify API Gateway',
    version: '1.0.0',
    authEnabled: process.env.AUTH_ENABLED === 'true',
    endpoints: {
      auth: '/api/auth/*',
      users: '/api/users/*',
      businesses: '/api/businesses/*',
      experiences: '/api/experiences/*'
    },
    documentation: 'Coming soon...'
  });
});

// Health check de servicios
router.get('/services/health', async (req, res) => {
  const results = {};
  
  for (const [key, service] of Object.entries(SERVICES)) {
    try {
      const axios = (await import('axios')).default;
      const response = await axios.get(`${service.url}/api/health`, { timeout: 3000 });
      results[key] = { status: 'UP', url: service.url };
    } catch (error) {
      results[key] = { status: 'DOWN', url: service.url, error: error.message };
    }
  }
  
  res.json({
    gateway: 'UP',
    services: results,
    timestamp: new Date().toISOString()
  });
});

// Rutas de cada dominio
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/businesses', businessRoutes);
router.use('/experiences', experienceRoutes);

// Placeholder para futuros servicios
router.use('/bookings', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'BookingService not implemented yet'
  });
});

router.use('/payments', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'PaymentService not implemented yet'
  });
});

router.use('/notifications', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'NotificationService not implemented yet'
  });
});

export default router;