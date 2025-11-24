import { businessService } from '../services/businessService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const businessController = {
  // Obtener todos los negocios del usuario
  getUserBusinesses: async (req, res) => {
    try {
      const userId = req.userId;
      
      const businesses = await businessService.getUserBusinesses(userId);
      
      successResponse(res, businesses, 'Negocios obtenidos exitosamente');
    } catch (error) {
      console.error('BusinessController - getUserBusinesses error:', error);
      
      if (error.status === 403) {
        return errorResponse(res, error.message, 403);
      }
      
      errorResponse(res, 'Error al obtener los negocios', 500);
    }
  },

  // Crear un nuevo negocio
  createBusiness: async (req, res) => {
    try {
      const userId = req.userId;
      const businessData = req.body;
      const logoFile = req.file; // Si usas multer para subida de archivos

      // Validar datos del negocio
      businessService.validateBusinessData(businessData);

      // Crear el negocio
      const newBusiness = await businessService.createBusiness(businessData, userId, logoFile);
      
      successResponse(res, newBusiness, 'Negocio creado exitosamente', 201);
    } catch (error) {
      console.error('BusinessController - createBusiness error:', error);
      
      if (error.status) {
        return errorResponse(res, error.message, error.status, error.errors);
      }
      
      // Manejar errores de duplicados de MySQL
      if (error.code === 'ER_DUP_ENTRY') {
        return errorResponse(res, 'Ya existe un negocio con ese nombre o email', 409);
      }
      
      errorResponse(res, 'Error al crear el negocio', 500);
    }
  },

  // Health check del controlador
  healthCheck: (req, res) => {
    successResponse(res, { 
      service: 'BusinessService',
      status: 'operational',
      timestamp: new Date().toISOString()
    }, 'Service is healthy');
  }
};