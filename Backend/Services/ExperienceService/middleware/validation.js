import Joi from 'joi';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const experienceSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required().messages({
    'string.empty': 'El título es requerido',
    'string.min': 'El título debe tener al menos 5 caracteres'
  }),
  description: Joi.string().trim().min(30).required().messages({
    'string.empty': 'La descripción es requerida',
    'string.min': 'La descripción debe tener al menos 30 caracteres'
  }),
  category: Joi.string().valid('aventura', 'cultura', 'gastronomia', 'naturaleza', 'deportes').required(),
  price: Joi.number().positive().required(),
  price_per_person: Joi.number().positive().required(),
  duration: Joi.string().trim().required().messages({
    'string.empty': 'La duración es requerida'
  }),
  location: Joi.string().trim().required().messages({
    'string.empty': 'La ubicación es requerida'
  }),
  meeting_point: Joi.string().trim().allow(''),
  main_image: Joi.string().trim().required().messages({
    'string.empty': 'La imagen principal es requerida'
  }),
  gallery: Joi.array().items(Joi.string()).max(10).optional(),
  availability: Joi.array().items(Joi.string().valid(...days)).min(1).required(),
  max_capacity: Joi.number().integer().positive().required()
});

export const validateExperienceCreation = (req, res, next) => {
  const { error } = experienceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

export const extractUserId = (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    req.userId = parseInt(userId, 10);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token de usuario inválido'
    });
  }
};

