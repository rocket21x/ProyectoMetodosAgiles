import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'AuthService',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes
router.use('/auth', authRoutes);

export default router;