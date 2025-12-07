import { authService } from '../services/authService.js';

export const authController = {
  // Registro de nuevo usuario
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      console.error('AuthController - register error:', error);
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al registrar usuario',
        errors: error.errors || null
      });
    }
  },

  // Inicio de sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      console.error('AuthController - login error:', error);
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al iniciar sesión'
      });
    }
  },

  // Verificar token (usado por API Gateway)
  verifyToken: async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const decoded = await authService.verifyAccessToken(token);
      
      res.status(200).json({
        success: true,
        data: decoded
      });
    } catch (error) {
      console.error('AuthController - verifyToken error:', error);
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  },

  // Renovar access token usando refresh token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token no proporcionado'
        });
      }

      const result = await authService.refreshAccessToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token renovado exitosamente',
        data: result
      });
    } catch (error) {
      console.error('AuthController - refreshToken error:', error);
      res.status(error.status || 401).json({
        success: false,
        message: error.message || 'Error al renovar token'
      });
    }
  },

  // Cerrar sesión
  logout: async (req, res) => {
    try {
      // En una implementación más robusta, aquí se invalidaría el token
      // Por ejemplo, agregándolo a una blacklist en Redis
      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
  },

  // Obtener usuario actual
  getCurrentUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const token = authHeader.split(' ')[1];
      const user = await authService.getUserFromToken(token);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('AuthController - getCurrentUser error:', error);
      res.status(error.status || 401).json({
        success: false,
        message: error.message || 'Error al obtener usuario'
      });
    }
  }
};