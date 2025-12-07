import app from './app.js';
import { connectDB } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    console.log('🚀 Starting AuthService...');
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    
    // Conectar a la base de datos
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`✅ AuthService running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Available endpoints:');
        console.log('  POST /api/auth/register  - Registrar usuario');
        console.log('  POST /api/auth/login     - Iniciar sesión');
        console.log('  POST /api/auth/verify    - Verificar token');
        console.log('  POST /api/auth/refresh   - Renovar token');
        console.log('  POST /api/auth/logout    - Cerrar sesión');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();