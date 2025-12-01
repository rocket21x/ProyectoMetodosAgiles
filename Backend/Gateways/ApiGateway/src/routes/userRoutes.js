import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { proxyToService } from '../middleware/proxy.js';
import { SERVICES } from '../config/services.js';

const router = express.Router();

const userUrl = SERVICES.USER.url;

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de usuario
router.get('/me', proxyToService(userUrl, '/api/users/me'));
router.put('/me', proxyToService(userUrl, '/api/users/me'));
router.get('/:id', proxyToService(userUrl, '/api/users/:id'));

export default router;