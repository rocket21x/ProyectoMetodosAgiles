import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fileUpload = {
  // Guardar imagen del logo del negocio
  saveBusinessLogo: async (file, businessId) => {
    try {
      const uploadsDir = path.join(__dirname, '../../uploads/business-logos');
      
      // Crear directorio si no existe
      await fs.mkdir(uploadsDir, { recursive: true });
      
      // Generar nombre único para el archivo
      const fileExtension = path.extname(file.originalname);
      const fileName = `business-${businessId}-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Guardar archivo
      await fs.writeFile(filePath, file.buffer);
      
      // Retornar ruta relativa para guardar en BD
      return `/uploads/business-logos/${fileName}`;
    } catch (error) {
      console.error('Error en fileUpload.saveBusinessLogo:', error);
      throw new Error('Error al guardar la imagen del negocio');
    }
  },

  // Validar tipo de archivo
  validateImageFile: (file) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Solo se permiten archivos JPG, JPEG o PNG');
    }
    
    if (file.size > maxSize) {
      throw new Error('La imagen no puede ser mayor a 5MB');
    }
    
    return true;
  },

  // Eliminar imagen anterior si existe
  deleteOldLogo: async (logoPath) => {
    try {
      if (logoPath && !logoPath.startsWith('http')) {
        const fullPath = path.join(__dirname, '../..', logoPath);
        await fs.unlink(fullPath);
      }
    } catch (error) {
      // No lanzar error si el archivo no existe
      if (error.code !== 'ENOENT') {
        console.error('Error al eliminar logo anterior:', error);
      }
    }
  }
};