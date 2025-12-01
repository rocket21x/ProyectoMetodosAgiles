import axios from 'axios';
import { SERVICES } from '../config/services.js';

const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

/**
 * Middleware de autenticación
 * - Si AUTH_ENABLED=false: usa usuario mock para desarrollo
 * - Si AUTH_ENABLED=true: valida JWT con AuthService
 */
export const authenticate = async (req, res, next) => {
  try {
    // MODO DESARROLLO: Auth deshabilitado
    if (!AUTH_ENABLED) {
      req.user = {
        userId: parseInt(process.env.MOCK_USER_ID) || 1,
        role: process.env.MOCK_USER_ROLE || 'provider',
        email: 'dev@localify.com'
      };
      req.userId = req.user.userId;
      return next();
    }

    // MODO PRODUCCIÓN: Validar JWT
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token con AuthService
    const response = await axios.post(
      `${SERVICES.AUTH.url}/api/auth/verify`, 
      { token },
      { timeout: 5000 }
    );
    
    if (response.data.success) {
      req.user = response.data.data;
      req.userId = response.data.data.userId;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    // Si AuthService no está disponible
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return res.status(503).json({
        success: false,
        message: 'Servicio de autenticación no disponible'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al verificar autenticación'
    });
  }
};

/**
 * Middleware de autenticación opcional
 * No falla si no hay token, pero agrega user si existe
 */
export const optionalAuth = async (req, res, next) => {
  // MODO DESARROLLO
  if (!AUTH_ENABLED) {
    req.user = {
      userId: parseInt(process.env.MOCK_USER_ID) || 1,
      role: process.env.MOCK_USER_ROLE || 'provider',
      email: 'dev@localify.com'
    };
    req.userId = req.user.userId;
    return next();
  }

  // MODO PRODUCCIÓN
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const response = await axios.post(
      `${SERVICES.AUTH.url}/api/auth/verify`, 
      { token },
      { timeout: 5000 }
    );
    
    if (response.data.success) {
      req.user = response.data.data;
      req.userId = response.data.data.userId;
    }
  } catch (error) {
    // Silenciosamente continuar sin auth
  }
  
  next();
};

/**
 * Middleware para verificar roles
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para esta acción'
      });
    }

    next();
  };
};