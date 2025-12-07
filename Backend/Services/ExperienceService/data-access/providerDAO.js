import pool from '../config/database.js';

export const providerDAO = {
  findById: async (providerId) => {
    const [rows] = await pool.execute(
      `SELECT id, user_id, business_name, description, bank_clabe, logo_image
       FROM providers
       WHERE id = ?`,
      [providerId]
    );
    return rows[0] || null;
  }
};

