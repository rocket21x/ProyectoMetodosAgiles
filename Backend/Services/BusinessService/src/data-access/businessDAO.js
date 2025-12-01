import pool from '../config/database.js';

export const businessDAO = {
  // Obtener todos los negocios de un usuario
  findByUserId: async (userId) => {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          id,
          business_name,
          email,
          phone,
          logo_image,
          active_state,
          bank_clabe
         FROM businesses 
         WHERE user_id = ? 
         ORDER BY id DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error en businessDAO.findByUserId:', error);
      throw new Error('Error al obtener negocios del usuario');
    }
  },

  // Crear un nuevo negocio
  create: async (businessData) => {
    const {
      user_id,
      business_name,
      email,
      phone,
      logo_image,
      active_state,
      bank_clabe
    } = businessData;

    try {
      const [result] = await pool.execute(
        `INSERT INTO businesses 
         (user_id, business_name, email, phone, logo_image, active_state, bank_clabe) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, business_name, email, phone, logo_image, active_state, bank_clabe]
      );

      // Obtener el negocio recién creado
      const [newBusiness] = await pool.execute(
        `SELECT 
          id,
          business_name,
          email,
          phone,
          logo_image,
          active_state,
          bank_clabe
         FROM businesses 
         WHERE id = ?`,
        [result.insertId]
      );

      return newBusiness[0];
    } catch (error) {
      console.error('Error en businessDAO.create:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ya existe un negocio con ese nombre o email');
      }
      
      throw new Error('Error al crear el negocio');
    }
  },

  // Actualizar logo del negocio
  updateLogo: async (businessId, logoPath) => {
    try {
      await pool.execute(
        'UPDATE businesses SET logo_image = ? WHERE id = ?',
        [JSON.stringify({ url: logoPath }), businessId]
      );
    } catch (error) {
      console.error('Error en businessDAO.updateLogo:', error);
      throw new Error('Error al actualizar logo del negocio');
    }
  },

  // Verificar si el usuario existe y tiene permisos
  validateUserBusiness: async (userId, businessId) => {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM businesses WHERE id = ? AND user_id = ?',
        [businessId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Error en businessDAO.validateUserBusiness:', error);
      throw new Error('Error al validar negocio del usuario');
    }
  },

  // Verificar si el nombre del negocio ya existe para este usuario
  isBusinessNameTaken: async (userId, businessName, excludeBusinessId = null) => {
    try {
      let query = `SELECT COUNT(*) as count 
                   FROM businesses 
                   WHERE user_id = ? AND business_name = ?`;
      const params = [userId, businessName];

      if (excludeBusinessId) {
        query += ' AND id != ?';
        params.push(excludeBusinessId);
      }

      const [rows] = await pool.execute(query, params);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error en businessDAO.isBusinessNameTaken:', error);
      throw new Error('Error al verificar nombre del negocio');
    }
  },

  // Verificar si el email del negocio ya existe para este usuario
  isBusinessEmailTaken: async (userId, email, excludeBusinessId = null) => {
    try {
      let query = `SELECT COUNT(*) as count 
                   FROM businesses 
                   WHERE user_id = ? AND email = ?`;
      const params = [userId, email];

      if (excludeBusinessId) {
        query += ' AND id != ?';
        params.push(excludeBusinessId);
      }

      const [rows] = await pool.execute(query, params);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error en businessDAO.isBusinessEmailTaken:', error);
      throw new Error('Error al verificar email del negocio');
    }
  },

  // Obtener estadísticas básicas del negocio (para futuro uso)
  getBusinessStats: async (businessId) => {
    try {
      const [experienceCount] = await pool.execute(
        'SELECT COUNT(*) as count FROM experiences WHERE business_id = ?',
        [businessId]
      );

      const [bookingCount] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM bookings b
         JOIN experiences e ON b.experience_id = e.id 
         WHERE e.business_id = ?`,
        [businessId]
      );

      return {
        experience_count: experienceCount[0].count,
        booking_count: bookingCount[0].count
      };
    } catch (error) {
      console.error('Error en businessDAO.getBusinessStats:', error);
      throw new Error('Error al obtener estadísticas del negocio');
    }
  }
};