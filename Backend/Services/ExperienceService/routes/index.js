import express from 'express';
import experienceRoutes from './experience.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'ExperienceService',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

router.use('/experiences', experienceRoutes);

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'ExperienceService API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      experiences: {
        list: 'GET /api/experiences',
        create: 'POST /api/experiences'
      }
    }
  });
});

export default router;

