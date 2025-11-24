import { businessDAO } from '../data-access/businessDAO.js';
import { userDAO } from '../data-access/userDAO.js';
import { fileUpload } from '../utils/fileUpload.js';

export const businessService = {
  // Obtener todos los negocios de un usuario
  getUserBusinesses: async (userId) => {
    try {
      // Verificar que el usuario existe y es proveedor/admin
      const user = await userDAO.findProviderById(userId);
      if (!user) {
        throw {
          status: 403,
          message: 'Usuario no autorizado para gestionar negocios'
        };
      }

      const businesses = await businessDAO.findByUserId(userId);
      
      // Formatear la respuesta para el frontend
      return businesses.map(business => ({
        id: business.id,
        business_name: business.business_name,
        email: business.email,
        phone: business.phone,
        logo_image: business.logo_image,
        active_state: business.active_state,
        bank_clabe: business.bank_clabe ? '••••' + business.bank_clabe.slice(-4) : null,
        created_at: business.created_at
      }));
    } catch (error) {
      console.error('BusinessService - getUserBusinesses error:', error);
      throw error;
    }
  },

  // Crear un nuevo negocio
  createBusiness: async (businessData, userId, logoFile = null) => {
    try {
      // Validar que el usuario existe y es proveedor/admin
      const user = await userDAO.findProviderById(userId);
      if (!user) {
        throw {
          status: 403,
          message: 'Usuario no autorizado para crear negocios'
        };
      }

      // Verificar límite de negocios (opcional, para futuro)
      const businessCount = await userDAO.countUserBusinesses(userId);
      if (businessCount >= 10) { // Límite de 10 negocios por usuario
        throw {
          status: 400,
          message: 'Has alcanzado el límite máximo de negocios permitidos'
        };
      }

      // Validar que el nombre del negocio no esté duplicado para este usuario
      const nameExists = await businessDAO.isBusinessNameTaken(userId, businessData.business_name);
      if (nameExists) {
        throw {
          status: 409,
          message: 'Ya tienes un negocio con ese nombre'
        };
      }

      // Validar que el email del negocio no esté duplicado para este usuario
      const emailExists = await businessDAO.isBusinessEmailTaken(userId, businessData.email);
      if (emailExists) {
        throw {
          status: 409,
          message: 'Ya tienes un negocio con ese email'
        };
      }

      // Procesar imagen del logo si se proporciona
      let logoImagePath = null;
      if (logoFile) {
        fileUpload.validateImageFile(logoFile);
        // Nota: La ruta real se asignará después de crear el negocio
        logoImagePath = '/uploads/business-logos/placeholder'; // Temporal
      }

      // Preparar datos para crear el negocio
      const businessToCreate = {
        user_id: userId,
        business_name: businessData.business_name,
        email: businessData.email,
        phone: businessData.phone,
        logo_image: logoImagePath,
        active_state: businessData.active_state,
        bank_clabe: businessData.bank_clabe || null
      };

      // Crear el negocio en la base de datos
      const newBusiness = await businessDAO.create(businessToCreate);

      // Si hay imagen, guardarla con el ID real del negocio
      if (logoFile && newBusiness.id) {
        const actualLogoPath = await fileUpload.saveBusinessLogo(logoFile, newBusiness.id);
        
        // Actualizar el negocio con la ruta real de la imagen
        await businessDAO.updateLogo(newBusiness.id, actualLogoPath);
        newBusiness.logo_image = actualLogoPath;
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
        message: 'Negocio creado exitosamente'
      };
    } catch (error) {
      console.error('BusinessService - createBusiness error:', error);
      throw error;
    }
  },

  // Validar datos del negocio (para uso interno)
  validateBusinessData: (businessData) => {
    const errors = [];

    // Validar nombre del negocio
    if (!businessData.business_name || businessData.business_name.trim().length < 2) {
      errors.push('El nombre del negocio debe tener al menos 2 caracteres');
    }

    if (businessData.business_name && businessData.business_name.length > 255) {
      errors.push('El nombre del negocio no puede exceder 255 caracteres');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!businessData.email || !emailRegex.test(businessData.email)) {
      errors.push('El email del negocio no es válido');
    }

    // Validar teléfono (formato básico)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!businessData.phone || !phoneRegex.test(businessData.phone.replace(/\s/g, ''))) {
      errors.push('El teléfono del negocio no es válido');
    }

    // Validar estado
    if (!businessData.active_state || !['active', 'inactive'].includes(businessData.active_state)) {
      errors.push('El estado del negocio debe ser "active" o "inactive"');
    }

    // Validar CLABE (si se proporciona)
    if (businessData.bank_clabe && businessData.bank_clabe.length !== 18) {
      errors.push('La CLABE bancaria debe tener 18 dígitos');
    }

    if (errors.length > 0) {
      throw {
        status: 400,
        message: 'Datos de negocio inválidos',
        errors: errors
      };
    }

    return true;
  }
};