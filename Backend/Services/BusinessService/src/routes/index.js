import express from 'express';
import businessRoutes from './businessRoutes.js';

const router = express.Router();

// Health check global
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'BusinessService',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Agrupar todas las rutas de negocios
router.use('/businesses', businessRoutes);

// Ruta por defecto
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'BusinessService API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      businesses: {
        list: 'GET /api/businesses',
        create: 'POST /api/businesses'
      }
    }
  });
});

export default router;