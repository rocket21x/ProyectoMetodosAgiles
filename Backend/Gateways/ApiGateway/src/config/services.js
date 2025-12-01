import dotenv from 'dotenv';
dotenv.config();

// Configuración centralizada de servicios
// Agregar nuevos servicios aquí conforme se vayan creando
export const SERVICES = {
  AUTH: {
    name: 'AuthService',
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3003',
    basePath: '/api/auth'
  },
  USER: {
    name: 'UserService',
    url: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    basePath: '/api/users'
  },
  BUSINESS: {
    name: 'BusinessService',
    url: process.env.BUSINESS_SERVICE_URL || 'http://localhost:3006',
    basePath: '/api/businesses'
  },
  EXPERIENCE: {
    name: 'ExperienceService',
    url: process.env.EXPERIENCE_SERVICE_URL || 'http://localhost:3002',
    basePath: '/api/experiences'
  },
  BOOKING: {
    name: 'BookingService',
    url: process.env.BOOKING_SERVICE_URL || 'http://localhost:3004',
    basePath: '/api/bookings'
  },
  PAYMENT: {
    name: 'PaymentService',
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    basePath: '/api/payments'
  },
  NOTIFICATION: {
    name: 'NotificationService',
    url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008', // Por implementar
    basePath: '/api/notifications'
  }
};

// Obtener URL completa de un servicio
export const getServiceUrl = (serviceName) => {
  const service = SERVICES[serviceName];
  if (!service) {
    throw new Error(`Service ${serviceName} not configured`);
  }
  return service.url;
};

// Obtener estado de todos los servicios (para logging)
export const getServiceStatus = () => {
  return Object.values(SERVICES).map(service => ({
    name: service.name,
    url: service.url
  }));
};