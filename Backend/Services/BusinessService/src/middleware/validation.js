import Joi from 'joi';

export const validateBusinessCreation = (req, res, next) => {
  const schema = Joi.object({
    business_name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'El nombre del negocio es requerido',
      'string.min': 'El nombre del negocio debe tener al menos 2 caracteres'
    }),
    email: Joi.string().email().optional().allow('').messages({
      'string.email': 'El formato del email no es válido'
    }),
    phone: Joi.string().min(10).max(20).required().messages({
      'string.empty': 'El teléfono es requerido',
      'string.min': 'El teléfono debe tener al menos 10 caracteres'
    }),
    active_state: Joi.string().valid('active', 'inactive').required().messages({
      'any.only': 'El estado debe ser "active" o "inactive"'
    }),
    bank_clabe: Joi.string().length(18).optional().allow('').messages({
      'string.length': 'La CLABE debe tener exactamente 18 dígitos'
    })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  
  next();
};