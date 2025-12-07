import express from 'express';
import { proxyToService } from '../middleware/proxy.js';
import { SERVICES } from '../config/services.js';

const router = express.Router();

const authUrl = SERVICES.AUTH.url;

// Rutas públicas - redirigen al AuthService
router.post('/register', proxyToService(authUrl, '/api/auth/register'));
router.post('/login', proxyToService(authUrl, '/api/auth/login'));
router.post('/refresh', proxyToService(authUrl, '/api/auth/refresh'));
router.post('/logout', proxyToService(authUrl, '/api/auth/logout'));

// Ruta interna (usada por el middleware de auth del gateway)
router.post('/verify', proxyToService(authUrl, '/api/auth/verify'));

// Obtener usuario actual (requiere token)
router.get('/me', proxyToService(authUrl, '/api/auth/me'));

export default router;