import { businessService } from '../services/businessService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const businessController = {
  /**
   * Obtener todos los negocios del usuario
   * GET /api/businesses
   */
  getUserBusinesses: async (req, res) => {
    try {
      const userId = req.user.id; // Asumimos que el middleware de auth agrega req.user
      
      const businesses = await businessService.getUserBusinesses(userId);
      
      successResponse(res, businesses, 'Negocios obtenidos exitosamente');
    } catch (error) {
      console.error('BusinessController - getUserBusinesses error:', error);
      
      if (error.name === 'AuthorizationError') {
        return errorResponse(res, error.message, error.status);
      }
      
      errorResponse(res, 'Error al obtener los negocios', 500);
    }
  },

  /**
   * Crear un nuevo negocio
   * POST /api/businesses
   */
  createBusiness: async (req, res) => {
    try {
      const userId = req.user.id;
      const businessData = req.body;
      const logoFile = req.file; // Asumimos que multer procesa la imagen

      // Validar datos básicos
      businessService.validateBusinessData(businessData);

      // Crear el negocio
      const newBusiness = await businessService.createBusiness(businessData, userId, logoFile);
      
      successResponse(res, newBusiness, 'Negocio creado exitosamente', 201);
    } catch (error) {
      console.error('BusinessController - createBusiness error:', error);
      
      // Manejar diferentes tipos de errores
      switch (error.name) {
        case 'ValidationError':
          return errorResponse(res, error.message, error.status, error.errors);
        
        case 'AuthorizationError':
          return errorResponse(res, error.message, error.status);
        
        case 'BusinessLimitError':
          return errorResponse(res, error.message, error.status);
        
        default:
          // Errores de base de datos o del sistema
          if (error.code === 'ER_DUP_ENTRY') {
            return errorResponse(res, 'Ya existe un negocio con ese nombre o email', 409);
          }
          errorResponse(res, 'Error al crear el negocio', 500);
      }
    }
  },

  /**
   * Health check del servicio
   * GET /health
   */
  healthCheck: (req, res) => {
    successResponse(res, {
      service: 'BusinessService',
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }
};