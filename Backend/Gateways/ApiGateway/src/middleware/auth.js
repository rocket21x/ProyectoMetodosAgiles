import axios from 'axios';
import { SERVICES } from '../config/services.js';

/**
 * Middleware de autenticación
 * Valida JWT con AuthService
 */
export const authenticate = async (req, res, next) => {
  try {
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
    console.log('Optional auth failed:', error.message);
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