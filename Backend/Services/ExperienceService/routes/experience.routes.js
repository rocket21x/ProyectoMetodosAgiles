import express from 'express';
import { experienceController } from '../controllers/experience.controller.js';
import { extractUserId, validateExperienceCreation } from '../middleware/validation.js';

const router = express.Router();

router.use(extractUserId); // todas las rutas requieren usuario autenticado

router.get('/', experienceController.getProviderExperiences);
router.get('/:id', experienceController.getExperienceById);
router.post('/', validateExperienceCreation, experienceController.createExperience);

export default router;

