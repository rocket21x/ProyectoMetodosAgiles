import express from 'express';
import { proxyToService } from '../middleware/proxy.js';
import { SERVICES } from '../config/services.js';

const router = express.Router();

const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

// Si AuthService no está habilitado, respuestas mock
if (!AUTH_ENABLED) {
  router.post('/register', (req, res) => {
    res.status(201).json({
      success: true,
      message: '[MOCK] Usuario registrado',
      data: {
        user: {
          id: 1,
          email: req.body.email,
          role: req.body.role || 'provider',
          first_name: req.body.first_name,
          last_name: req.body.last_name
        },
        accessToken: 'mock-token-12345',
        refreshToken: 'mock-refresh-token-12345'
      }
    });
  });

  router.post('/login', (req, res) => {
    res.status(200).json({
      success: true,
      message: '[MOCK] Login exitoso',
      data: {
        user: {
          id: parseInt(process.env.MOCK_USER_ID) || 1,
          email: req.body.email,
          role: process.env.MOCK_USER_ROLE || 'provider',
          first_name: 'Dev',
          last_name: 'User'
        },
        accessToken: 'mock-token-12345',
        refreshToken: 'mock-refresh-token-12345'
      }
    });
  });

  router.post('/verify', (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        userId: parseInt(process.env.MOCK_USER_ID) || 1,
        email: 'dev@localify.com',
        role: process.env.MOCK_USER_ROLE || 'provider'
      }
    });
  });

  router.post('/logout', (req, res) => {
    res.status(200).json({
      success: true,
      message: '[MOCK] Logout exitoso'
    });
  });
} else {
  // AuthService real
  const authUrl = SERVICES.AUTH.url;
  
  router.post('/register', proxyToService(authUrl, '/api/auth/register'));
  router.post('/login', proxyToService(authUrl, '/api/auth/login'));
  router.post('/verify', proxyToService(authUrl, '/api/auth/verify'));
  router.post('/refresh', proxyToService(authUrl, '/api/auth/refresh'));
  router.post('/logout', proxyToService(authUrl, '/api/auth/logout'));
}

export default router;