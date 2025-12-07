import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { proxyToService } from '../middleware/proxy.js';
import { SERVICES } from '../config/services.js';

const router = express.Router();

const experienceUrl = SERVICES.EXPERIENCE.url;

// Rutas públicas (cualquiera puede ver experiencias)
router.get('/', optionalAuth, proxyToService(experienceUrl, '/api/experiences'));
router.get('/:id', optionalAuth, proxyToService(experienceUrl, '/api/experiences/:id'));

// Rutas protegidas (solo usuarios autenticados)
router.post('/', authenticate, proxyToService(experienceUrl, '/api/experiences'));
router.put('/:id', authenticate, proxyToService(experienceUrl, '/api/experiences/:id'));
router.delete('/:id', authenticate, proxyToService(experienceUrl, '/api/experiences/:id'));

export default router;