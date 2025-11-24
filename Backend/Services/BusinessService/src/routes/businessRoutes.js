import express from 'express';
import { businessController } from '../controllers/businessController.js';
import { extractUserId, validateBusinessCreation } from '../middleware/validation.js';

const router = express.Router();

// Todas las rutas requieren autenticación (user_id en headers)
router.use(extractUserId);

// Obtener negocios del usuario
router.get('/', businessController.getUserBusinesses);

// Crear nuevo negocio
router.post('/', validateBusinessCreation, businessController.createBusiness);

export default router;