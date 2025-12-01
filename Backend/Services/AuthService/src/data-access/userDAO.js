import pool from '../config/database.js';

export const userDAO = {
  /**
   * Buscar usuario por email
   */
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error en userDAO.findByEmail:', error);
      throw new Error('Error al buscar usuario por email');
    }
  },

  /**
   * Buscar usuario por ID
   */
  findById: async (id) => {
    try {
      const [rows] = await pool.execute(
        `SELECT id, email, role, first_name, last_name, phone, avatar_url 
         FROM users WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error en userDAO.findById:', error);
      throw new Error('Error al buscar usuario');
    }
  },

  /**
   * Crear nuevo usuario
   */
  create: async (userData) => {
    const { email, password_hash, role, first_name, last_name, phone } = userData;
    
    try {
      const [result] = await pool.execute(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, phone) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [email, password_hash, role, first_name, last_name, phone]
      );

      return {
        id: result.insertId,
        email,
        role,
        first_name,
        last_name,
        phone
      };
    } catch (error) {
      console.error('Error en userDAO.create:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 409, message: 'El email ya está registrado' };
      }
      
      throw new Error('Error al crear usuario');
    }
  },

  /**
   * Actualizar usuario
   */
  update: async (id, userData) => {
    const { first_name, last_name, phone, avatar_url } = userData;
    
    try {
      await pool.execute(
        `UPDATE users 
         SET first_name = ?, last_name = ?, phone = ?, avatar_url = ?
         WHERE id = ?`,
        [first_name, last_name, phone, avatar_url, id]
      );

      return await userDAO.findById(id);
    } catch (error) {
      console.error('Error en userDAO.update:', error);
      throw new Error('Error al actualizar usuario');
    }
  },

  /**
   * Actualizar contraseña
   */
  updatePassword: async (id, password_hash) => {
    try {
      await pool.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [password_hash, id]
      );
      return true;
    } catch (error) {
      console.error('Error en userDAO.updatePassword:', error);
      throw new Error('Error al actualizar contraseña');
    }
  }
};