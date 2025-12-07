import pool from '../config/database.js';

export const userDAO = {
  // Buscar cualquier usuario por ID
  findById: async (userId) => {
    try {
      const [rows] = await pool.execute(
        `SELECT id, email, role, first_name, last_name 
         FROM users 
         WHERE id = ?`,
        [userId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error en userDAO.findById:', error);
      throw new Error('Error al buscar usuario');
    }
  },

  // Contar negocios del usuario
  countUserBusinesses: async (userId) => {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM businesses WHERE user_id = ?',
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      console.error('Error en userDAO.countUserBusinesses:', error);
      throw new Error('Error al contar negocios del usuario');
    }
  },

  // Actualizar rol del usuario a 'provider'
  upgradeToProvider: async (userId) => {
    try {
      await pool.execute(
        `UPDATE users SET role = 'provider' WHERE id = ? AND role = 'customer'`,
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Error en userDAO.upgradeToProvider:', error);
      throw new Error('Error al actualizar rol del usuario');
    }
  }
};