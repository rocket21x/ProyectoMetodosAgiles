import { businessDAO } from '../data-access/businessDAO.js';
import { userDAO } from '../data-access/userDAO.js';
import { fileUpload } from '../utils/fileUpload.js';

export const businessService = {
  /**
   * Obtener todos los negocios de un usuario
   */
  getUserBusinesses: async (userId) => {
    try {
      // Verificar que el usuario existe y es proveedor/admin
      const user = await userDAO.findProviderById(userId);
      if (!user) {
        throw {
          name: 'AuthorizationError',
          message: 'Usuario no autorizado para gestionar negocios',
          status: 403
        };
      }

      // Obtener negocios del usuario
      const businesses = await businessDAO.findByUserId(userId);
      
      // Formatear respuesta para el frontend
      return businesses.map(business => ({
        id: business.id,
        business_name: business.business_name,
        email: business.email,
        phone: business.phone,
        logo_image: business.logo_image,
        active_state: business.active_state,
        bank_clabe: business.bank_clabe ? '••••' + business.bank_clabe.slice(-4) : null, // Enmascarar para seguridad
        created_at: business.created_at,
        // Campos calculados para la UI
        status: business.active_state === 'active' ? 'Activo' : 'Inactivo',
        action_required: !business.bank_clabe // Si no tiene CLABE, requiere acción
      }));
    } catch (error) {
      console.error('BusinessService - getUserBusinesses error:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo negocio
   */
  createBusiness: async (businessData, userId, logoFile = null) => {
    try {
      // Validar que el usuario existe y es proveedor/admin
      const user = await userDAO.findProviderById(userId);
      if (!user) {
        throw {
          name: 'AuthorizationError',
          message: 'Usuario no autorizado para crear negocios',
          status: 403
        };
      }

      // Verificar límite de negocios (opcional - puedes ajustar el límite)
      const businessCount = await userDAO.countUserBusinesses(userId);
      if (businessCount >= 10) { // Límite de 10 negocios por usuario
        throw {
          name: 'BusinessLimitError',
          message: 'Has alcanzado el límite máximo de negocios permitidos',
          status: 400
        };
      }

      // Verificar si el nombre del negocio ya existe para este usuario
      const nameExists = await businessDAO.isBusinessNameTaken(userId, businessData.business_name);
      if (nameExists) {
        throw {
          name: 'ValidationError',
          message: 'Ya tienes un negocio con ese nombre',
          field: 'business_name',
          status: 400
        };
      }

      // Verificar si el email del negocio ya existe para este usuario
      if (businessData.email) {
        const emailExists = await businessDAO.isBusinessEmailTaken(userId, businessData.email);
        if (emailExists) {
          throw {
            name: 'ValidationError',
            message: 'Ya tienes un negocio con ese email',
            field: 'email',
            status: 400
          };
        }
      }

      // Procesar imagen del logo si se proporciona
      let logoImageData = null;
      if (logoFile) {
        fileUpload.validateImageFile(logoFile);
        // Guardamos temporalmente sin businessId, luego actualizaremos
        const tempPath = await fileUpload.saveBusinessLogo(logoFile, `temp-${userId}`);
        logoImageData = { url: tempPath, filename: logoFile.originalname };
      }

      // Preparar datos para crear el negocio
      const businessToCreate = {
        user_id: userId,
        business_name: businessData.business_name,
        email: businessData.email,
        phone: businessData.phone,
        logo_image: logoImageData,
        active_state: businessData.active_state,
        bank_clabe: businessData.bank_clabe || null
      };

      // Crear el negocio en la base de datos
      const newBusiness = await businessDAO.create(businessToCreate);

      // Si hay imagen, actualizar con el businessId real
      if (logoFile && logoImageData) {
        const finalPath = await fileUpload.renameBusinessLogo(
          logoImageData.url, 
          `business-${newBusiness.id}`
        );
        
        // Actualizar el negocio con la ruta final de la imagen
        await businessDAO.updateLogo(newBusiness.id, { url: finalPath, filename: logoFile.originalname });
        newBusiness.logo_image = { url: finalPath, filename: logoFile.originalname };
      }

      // Formatear respuesta
      return {
        id: newBusiness.id,
        business_name: newBusiness.business_name,
        email: newBusiness.email,
        phone: newBusiness.phone,
        logo_image: newBusiness.logo_image,
        active_state: newBusiness.active_state,
        bank_clabe: newBusiness.bank_clabe ? '••••' + newBusiness.bank_clabe.slice(-4) : null,
        created_at: newBusiness.created_at,
        message: 'Negocio registrado exitosamente'
      };

    } catch (error) {
      console.error('BusinessService - createBusiness error:', error);
      
      // Limpiar imagen temporal si hubo error
      if (logoFile && businessData.logo_image) {
        await fileUpload.deleteOldLogo(businessData.logo_image.url);
      }
      
      throw error;
    }
  },

  /**
   * Validar datos del negocio antes de crear
   */
  validateBusinessData: (businessData) => {
    const errors = [];

    // Validar nombre del negocio
    if (!businessData.business_name || businessData.business_name.trim().length < 2) {
      errors.push({
        field: 'business_name',
        message: 'El nombre del negocio debe tener al menos 2 caracteres'
      });
    }

    // Validar email
    if (businessData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(businessData.email)) {
        errors.push({
          field: 'email',
          message: 'El formato del email no es válido'
        });
      }
    }

    // Validar teléfono (formato básico)
    if (businessData.phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(businessData.phone.replace(/\s/g, ''))) {
        errors.push({
          field: 'phone',
          message: 'El formato del teléfono no es válido'
        });
      }
    }

    // Validar estado activo
    if (!businessData.active_state || !['active', 'inactive'].includes(businessData.active_state)) {
      errors.push({
        field: 'active_state',
        message: 'El estado del negocio debe ser "active" o "inactive"'
      });
    }

    // Validar CLABE (si se proporciona)
    if (businessData.bank_clabe) {
      const clabeRegex = /^[0-9]{18}$/;
      if (!clabeRegex.test(businessData.bank_clabe)) {
        errors.push({
          field: 'bank_clabe',
          message: 'La CLABE debe tener exactamente 18 dígitos'
        });
      }
    }

    if (errors.length > 0) {
      throw {
        name: 'ValidationError',
        message: 'Errores de validación en los datos del negocio',
        errors: errors,
        status: 400
      };
    }

    return true;
  }
};