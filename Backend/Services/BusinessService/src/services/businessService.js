import { businessDAO } from '../data-access/businessDAO.js';
import { userDAO } from '../data-access/userDAO.js';
import { fileUpload } from '../utils/fileUpload.js';

export const businessService = {
  // Obtener todos los negocios de un usuario
  getUserBusinesses: async (userId) => {
    try {
      // Verificar que el usuario existe
      const user = await userDAO.findById(userId);
      if (!user) {
        throw {
          status: 404,
          message: 'Usuario no encontrado'
        };
      }

      // Solo providers y admins pueden tener negocios
      if (user.role !== 'provider' && user.role !== 'admin') {
        // Retornar lista vacía si es customer
        return [];
      }

      const businesses = await businessDAO.findByUserId(userId);
      
      return businesses.map(business => ({
        id: business.id,
        business_name: business.business_name,
        email: business.email,
        phone: business.phone,
        logo_image: business.logo_image,
        active_state: business.active_state,
        bank_clabe: business.bank_clabe ? '••••' + business.bank_clabe.slice(-4) : null
      }));
    } catch (error) {
      console.error('BusinessService - getUserBusinesses error:', error);
      throw error;
    }
  },

  // Crear un nuevo negocio
  createBusiness: async (businessData, userId, logoFile = null) => {
    try {
      // Verificar que el usuario existe
      const user = await userDAO.findById(userId);
      if (!user) {
        throw {
          status: 404,
          message: 'Usuario no encontrado'
        };
      }

      // Verificar límite de negocios
      const businessCount = await userDAO.countUserBusinesses(userId);
      if (businessCount >= 10) {
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
      if (businessData.email) {
        const emailExists = await businessDAO.isBusinessEmailTaken(userId, businessData.email);
        if (emailExists) {
          throw {
            status: 409,
            message: 'Ya tienes un negocio con ese email'
          };
        }
      }

      // Procesar imagen del logo si se proporciona
      let logoImagePath = null;
      if (logoFile) {
        fileUpload.validateImageFile(logoFile);
        logoImagePath = '/uploads/business-logos/placeholder';
      }

      // Preparar datos para crear el negocio
      const businessToCreate = {
        user_id: userId,
        business_name: businessData.business_name,
        email: businessData.email,
        phone: businessData.phone,
        logo_image: logoImagePath,
        active_state: businessData.active_state || 'active',
        bank_clabe: businessData.bank_clabe || null
      };

      // Crear el negocio en la base de datos
      const newBusiness = await businessDAO.create(businessToCreate);

      // Si hay imagen, guardarla con el ID real del negocio
      if (logoFile && newBusiness.id) {
        const actualLogoPath = await fileUpload.saveBusinessLogo(logoFile, newBusiness.id);
        await businessDAO.updateLogo(newBusiness.id, actualLogoPath);
        newBusiness.logo_image = actualLogoPath;
      }

      // *** IMPORTANTE: Cambiar rol de customer a provider ***
      if (user.role === 'customer') {
        await userDAO.upgradeToProvider(userId);
        console.log(`Usuario ${userId} actualizado a provider`);
      }

      return {
        id: newBusiness.id,
        business_name: newBusiness.business_name,
        email: newBusiness.email,
        phone: newBusiness.phone,
        logo_image: newBusiness.logo_image,
        active_state: newBusiness.active_state,
        bank_clabe: newBusiness.bank_clabe ? '••••' + newBusiness.bank_clabe.slice(-4) : null,
        message: 'Negocio creado exitosamente',
        // Indicar que el rol cambió
        roleUpgraded: user.role === 'customer'
      };
    } catch (error) {
      console.error('BusinessService - createBusiness error:', error);
      throw error;
    }
  },

  // Validar datos del negocio
  validateBusinessData: (businessData) => {
    const errors = [];

    if (!businessData.business_name || businessData.business_name.trim().length < 2) {
      errors.push('El nombre del negocio debe tener al menos 2 caracteres');
    }

    if (businessData.business_name && businessData.business_name.length > 255) {
      errors.push('El nombre del negocio no puede exceder 255 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (businessData.email && !emailRegex.test(businessData.email)) {
      errors.push('El email del negocio no es válido');
    }

    if (businessData.phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(businessData.phone.replace(/\s/g, ''))) {
        errors.push('El teléfono del negocio no es válido');
      }
    }

    if (businessData.active_state && !['active', 'inactive'].includes(businessData.active_state)) {
      errors.push('El estado del negocio debe ser "active" o "inactive"');
    }

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