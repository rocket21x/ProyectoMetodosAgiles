import pool from '../config/database.js';

const mapExperienceRow = (row) => ({
  id: row.id,
  provider_id: row.provider_id,
  title: row.title,
  description: row.description,
  category: row.category,
  price: Number(row.price),
  price_per_person: Number(row.price_per_person),
  duration: row.duration,
  location: row.location,
  meeting_point: row.meeting_point,
  main_image: row.main_image,
  gallery: row.gallery ? JSON.parse(row.gallery) : [],
  availability: row.availability ? JSON.parse(row.availability) : [],
  max_capacity: row.max_capacity,
  status: row.status,
  created_at: row.created_at
});

export const experienceDAO = {
  findByProviderId: async (providerId) => {
    const [rows] = await pool.execute(
      `SELECT id, provider_id, title, description, category, price, price_per_person, duration,
        location, meeting_point, main_image, gallery, availability, max_capacity, status, created_at
       FROM experiences
       WHERE provider_id = ?
       ORDER BY created_at DESC`,
      [providerId]
    );
    return rows.map(mapExperienceRow);
  },

  findById: async (id) => {
    const [rows] = await pool.execute(
      `SELECT id, provider_id, title, description, category, price, price_per_person, duration,
        location, meeting_point, main_image, gallery, availability, max_capacity, status, created_at
       FROM experiences
       WHERE id = ?`,
      [id]
    );
    return rows[0] ? mapExperienceRow(rows[0]) : null;
  },

  isTitleTaken: async (providerId, title) => {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM experiences
       WHERE provider_id = ? AND title = ?`,
      [providerId, title]
    );
    return rows[0].count > 0;
  },

  create: async (experienceData) => {
    const {
      provider_id,
      title,
      description,
      category,
      price,
      price_per_person,
      duration,
      location,
      meeting_point,
      main_image,
      gallery,
      availability,
      max_capacity,
      status
    } = experienceData;

    const [result] = await pool.execute(
      `INSERT INTO experiences
        (provider_id, title, description, category, price, price_per_person, duration,
         location, meeting_point, main_image, gallery, availability, max_capacity, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        provider_id,
        title,
        description,
        category,
        price,
        price_per_person,
        duration,
        location,
        meeting_point,
        main_image,
        JSON.stringify(gallery),
        JSON.stringify(availability),
        max_capacity,
        status
      ]
    );

    const [rows] = await pool.execute(
      `SELECT id, provider_id, title, description, category, price, price_per_person, duration,
        location, meeting_point, main_image, gallery, availability, max_capacity, status, created_at
       FROM experiences
       WHERE id = ?`,
      [result.insertId]
    );

    return rows[0] ? mapExperienceRow(rows[0]) : null;
  }
};

