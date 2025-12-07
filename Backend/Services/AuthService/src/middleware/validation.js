import Joi from 'joi';

/**
 * Validación para registro de usuario
 * No se permite elegir rol - siempre será 'customer'
 */
export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email no es válido',
        'any.required': 'El email es requerido',
        'string.empty': 'El email es requerido'
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.max': 'La contraseña no puede exceder 100 caracteres',
        'any.required': 'La contraseña es requerida',
        'string.empty': 'La contraseña es requerida'
      }),
    first_name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es requerido',
        'string.empty': 'El nombre es requerido'
      }),
    last_name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede exceder 100 caracteres',
        'any.required': 'El apellido es requerido',
        'string.empty': 'El apellido es requerido'
      }),
    phone: Joi.string()
      .pattern(/^[\+]?[0-9\s\-\(\)]{10,20}$/)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'El teléfono no es válido'
      })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validación para login
 */
export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email no es válido',
        'any.required': 'El email es requerido',
        'string.empty': 'El email es requerido'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'La contraseña es requerida',
        'string.empty': 'La contraseña es requerida'
      })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
};