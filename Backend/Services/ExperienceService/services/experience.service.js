import { experienceDAO } from '../data-access/experienceDAO.js';
import { providerDAO } from '../data-access/providerDAO.js';

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const ensureProvider = async (providerId) => {
  const provider = await providerDAO.findById(providerId);
  if (!provider) {
    throw {
      status: 403,
      message: 'Proveedor no encontrado o no autorizado'
    };
  }
  return provider;
};

export const experienceService = {
  getProviderExperiences: async (providerId) => {
    await ensureProvider(providerId);
    return experienceDAO.findByProviderId(providerId);
  },

  getExperienceById: async (experienceId) => {
    const experience = await experienceDAO.findById(experienceId);
    if (!experience) {
      throw {
        status: 404,
        message: 'Experience not found'
      };
    }
    return experience;
  },

  createExperience: async (payload, providerId) => {
    await ensureProvider(providerId);

    if (await experienceDAO.isTitleTaken(providerId, payload.title)) {
      throw {
        status: 409,
        message: 'Ya existe una experiencia con ese título'
      };
    }

    const price = Number(payload.price) || Number(payload.price_per_person) || 0;
    const pricePerPerson = Number(payload.price_per_person) || Number(payload.price) || 0;

    const experienceToCreate = {
      provider_id: providerId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      category: payload.category,
      price,
      price_per_person: pricePerPerson,
      duration: payload.duration,
      location: payload.location,
      meeting_point: payload.meeting_point || payload.location,
      main_image: payload.main_image,
      gallery: normalizeArray(payload.gallery),
      availability: normalizeArray(payload.availability),
      max_capacity: payload.max_capacity ? parseInt(payload.max_capacity, 10) : null,
      status: 'pending'
    };

    return experienceDAO.create(experienceToCreate);
  }
};

