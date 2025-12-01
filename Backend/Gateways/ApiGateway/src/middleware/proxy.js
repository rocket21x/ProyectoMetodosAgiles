import axios from 'axios';

/**
 * Crea un middleware proxy hacia un servicio
 * @param {string} serviceUrl - URL base del servicio
 * @param {string} path - Path en el servicio destino
 */
export const proxyToService = (serviceUrl, path) => {
  return async (req, res) => {
    try {
      // Construir path final reemplazando parámetros
      let finalPath = path;
      Object.keys(req.params).forEach(param => {
        finalPath = finalPath.replace(`:${param}`, req.params[param]);
      });

      const url = `${serviceUrl}${finalPath}`;
      
      // Headers para el servicio
      const headers = {
        'Content-Type': 'application/json'
      };

      // Pasar información del usuario autenticado
      if (req.userId) {
        headers['x-user-id'] = req.userId.toString();
      }
      if (req.user) {
        headers['x-user-role'] = req.user.role;
        headers['x-user-email'] = req.user.email;
      }

      // Configuración de la petición
      const config = {
        method: req.method.toLowerCase(),
        url,
        headers,
        params: req.query,
        timeout: 30000 // 30 segundos timeout
      };

      // Agregar body si no es GET
      if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }

      console.log(`  → Proxy to: ${url}`);
      
      // Hacer petición al servicio
      const response = await axios(config);
      
      // Devolver respuesta
      res.status(response.status).json(response.data);
      
    } catch (error) {
      handleProxyError(error, serviceUrl, path, res);
    }
  };
};

/**
 * Maneja errores del proxy
 */
const handleProxyError = (error, serviceUrl, path, res) => {
  console.error(`  ✗ Proxy error to ${serviceUrl}${path}:`, error.message);
  
  if (error.response) {
    // El servicio respondió con error
    return res.status(error.response.status).json(error.response.data);
  }
  
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Servicio no disponible',
      service: serviceUrl
    });
  }
  
  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
    return res.status(504).json({
      success: false,
      message: 'Tiempo de espera agotado'
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'Error interno del gateway'
  });
};

/**
 * Crea proxy con transformación de respuesta
 */
export const proxyWithTransform = (serviceUrl, path, transformFn) => {
  return async (req, res) => {
    try {
      let finalPath = path;
      Object.keys(req.params).forEach(param => {
        finalPath = finalPath.replace(`:${param}`, req.params[param]);
      });

      const url = `${serviceUrl}${finalPath}`;
      
      const headers = { 'Content-Type': 'application/json' };
      if (req.userId) headers['x-user-id'] = req.userId.toString();
      if (req.user) {
        headers['x-user-role'] = req.user.role;
        headers['x-user-email'] = req.user.email;
      }

      const config = {
        method: req.method.toLowerCase(),
        url,
        headers,
        params: req.query,
        timeout: 30000
      };

      if (req.method !== 'GET' && req.body) {
        config.data = req.body;
      }

      const response = await axios(config);
      
      // Aplicar transformación si existe
      const transformedData = transformFn ? transformFn(response.data) : response.data;
      
      res.status(response.status).json(transformedData);
      
    } catch (error) {
      handleProxyError(error, serviceUrl, path, res);
    }
  };
};