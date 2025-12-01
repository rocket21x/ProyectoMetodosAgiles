import pool from '../config/database.js';

export const userDAO = {
  // Buscar usuario proveedor o admin por ID
  findProviderById: async (userId) => {
    try {
      const [rows] = await pool.execute(
        `SELECT id, email, role, first_name, last_name 
         FROM users 
         WHERE id = ? AND role IN ('provider', 'admin')`,
        [userId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error en userDAO.findProviderById:', error);
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
  }
};