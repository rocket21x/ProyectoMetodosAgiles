import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { proxyToService } from '../middleware/proxy.js';
import { SERVICES } from '../config/services.js';

const router = express.Router();

const businessUrl = SERVICES.BUSINESS.url;

// Todas las rutas requieren autenticación
router.use(authenticate);

// CRUD de negocios
router.get('/', proxyToService(businessUrl, '/api/businesses'));
router.post('/', proxyToService(businessUrl, '/api/businesses'));
router.get('/:id', proxyToService(businessUrl, '/api/businesses/:id'));
router.put('/:id', proxyToService(businessUrl, '/api/businesses/:id'));
router.delete('/:id', proxyToService(businessUrl, '/api/businesses/:id'));

export default router;