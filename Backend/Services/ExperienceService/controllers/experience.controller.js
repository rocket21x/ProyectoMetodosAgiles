import { experienceService } from '../services/experience.service.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const experienceController = {
  getProviderExperiences: async (req, res) => {
    try {
      const providerId = req.userId;
      const experiences = await experienceService.getProviderExperiences(providerId);
      successResponse(res, experiences, 'Experiencias obtenidas correctamente');
    } catch (error) {
      console.error('ExperienceController - getProviderExperiences error:', error);
      if (error.status) {
        return errorResponse(res, error.message, error.status);
      }
      errorResponse(res, 'Error al obtener experiencias', 500);
    }
  },

  getExperienceById: async (req, res) => {
    try {
      const { id } = req.params;
      const experience = await experienceService.getExperienceById(id);
      successResponse(res, experience, 'Experiencia encontrada');
    } catch (error) {
      console.error('ExperienceController - getExperienceById error:', error);
      if (error.status === 404) {
        return errorResponse(res, error.message, 404);
      }
      errorResponse(res, 'Error al obtener la experiencia', 500);
    }
  },

  createExperience: async (req, res) => {
    try {
      const providerId = req.userId;
      const payload = req.body;
      const experience = await experienceService.createExperience(payload, providerId);
      successResponse(res, experience, 'Experiencia creada exitosamente', 201);
    } catch (error) {
      console.error('ExperienceController - createExperience error:', error);
      if (error.status) {
        return errorResponse(res, error.message, error.status, error.errors);
      }
      errorResponse(res, 'Error al crear la experiencia', 500);
    }
  }
};

