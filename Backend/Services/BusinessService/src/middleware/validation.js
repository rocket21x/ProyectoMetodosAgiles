import Joi from 'joi';

export const validateBusinessCreation = (req, res, next) => {
  const schema = Joi.object({
    business_name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'El nombre del negocio es requerido',
      'string.min': 'El nombre del negocio debe tener al menos 2 caracteres',
      'string.max': 'El nombre del negocio no puede exceder 255 caracteres'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'El email del negocio no es válido',
      'string.empty': 'El email del negocio es requerido'
    }),
    phone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/).required().messages({
      'string.pattern.base': 'El teléfono del negocio no es válido',
      'string.empty': 'El teléfono del negocio es requerido'
    }),
    active_state: Joi.string().valid('active', 'inactive').required().messages({
      'any.only': 'El estado debe ser "active" o "inactive"',
      'string.empty': 'El estado del negocio es requerido'
    }),
    bank_clabe: Joi.string().length(18).optional().allow('').messages({
      'string.length': 'La CLABE bancaria debe tener 18 dígitos'
    })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para extraer user_id del header (proveniente del API Gateway)
export const extractUserId = (req, res, next) => {
  try {
    // El API Gateway debe incluir el user_id en los headers después de validar el JWT
    const userId = req.headers['x-user-id'] || req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    req.userId = parseInt(userId);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token de usuario inválido'
    });
  }
};