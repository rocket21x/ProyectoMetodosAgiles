import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userDAO } from '../data-access/userDAO.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export const authService = {
  /**
   * Registrar nuevo usuario
   * SIEMPRE se registra como 'customer', el rol cambia a 'provider' al crear un negocio
   */
  register: async (userData) => {
    const { email, password, first_name, last_name, phone } = userData;

    // Verificar si el email ya existe
    const existingUser = await userDAO.findByEmail(email);
    if (existingUser) {
      throw { status: 409, message: 'El email ya está registrado' };
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario SIEMPRE como customer
    const newUser = await userDAO.create({
      email,
      password_hash,
      role: 'customer', // Siempre customer al registrar
      first_name,
      last_name,
      phone: phone || null
    });

    // Generar tokens
    const tokens = generateTokens(newUser);

    return {
      user: formatUserResponse(newUser),
      ...tokens
    };
  },

  /**
   * Iniciar sesión
   */
  login: async (email, password) => {
    const user = await userDAO.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Credenciales inválidas' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw { status: 401, message: 'Credenciales inválidas' };
    }

    const tokens = generateTokens(user);

    return {
      user: formatUserResponse(user),
      ...tokens
    };
  },

  /**
   * Verificar access token
   */
  verifyAccessToken: async (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Obtener el rol actual del usuario (puede haber cambiado)
      const user = await userDAO.findById(decoded.userId);
      if (!user) {
        throw { status: 401, message: 'Usuario no encontrado' };
      }
      
      return {
        userId: user.id,
        email: user.email,
        role: user.role // Rol actual de la BD
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw { status: 401, message: 'Token expirado' };
      }
      if (error.status) throw error;
      throw { status: 401, message: 'Token inválido' };
    }
  },

  /**
   * Renovar access token usando refresh token
   */
  refreshAccessToken: async (refreshToken) => {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      
      const user = await userDAO.findById(decoded.userId);
      if (!user) {
        throw { status: 401, message: 'Usuario no encontrado' };
      }

      // Generar nuevo token con el rol ACTUAL
      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return {
        accessToken,
        user: formatUserResponse(user)
      };
    } catch (error) {
      if (error.status) throw error;
      throw { status: 401, message: 'Refresh token inválido o expirado' };
    }
  },

  /**
   * Obtener usuario desde token
   */
  getUserFromToken: async (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userDAO.findById(decoded.userId);
      
      if (!user) {
        throw { status: 404, message: 'Usuario no encontrado' };
      }

      return formatUserResponse(user);
    } catch (error) {
      if (error.status) throw error;
      throw { status: 401, message: 'Token inválido' };
    }
  }
};

/**
 * Generar access token y refresh token
 */
function generateTokens(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });
  
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { 
    expiresIn: JWT_REFRESH_EXPIRES_IN 
  });

  return { accessToken, refreshToken };
}

/**
 * Formatear respuesta de usuario (sin datos sensibles)
 */
function formatUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || null,
    avatar_url: user.avatar_url || null
  };
}