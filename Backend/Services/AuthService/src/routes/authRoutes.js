import express from 'express';
import { authController } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Registro de usuario
router.post('/register', validateRegister, authController.register);

// Inicio de sesión
router.post('/login', validateLogin, authController.login);

// Verificar token (usado por API Gateway)
router.post('/verify', authController.verifyToken);

// Renovar access token
router.post('/refresh', authController.refreshToken);

// Cerrar sesión
router.post('/logout', authController.logout);

// Obtener usuario actual (requiere token)
router.get('/me', authController.getCurrentUser);

export default router;