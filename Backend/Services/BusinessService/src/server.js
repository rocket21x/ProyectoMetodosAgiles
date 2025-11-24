import app from './app.js';
import { connectDB } from './config/database.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3020;

const startServer = async () => {
  try {
    console.log('🚀 Starting BusinessService...');
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    
    // Connect to database first
    console.log('🔗 Connecting to database...');
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ BusinessService running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Available endpoints:');
        console.log('  GET  /api/health           - Health check');
        console.log('  GET  /api/businesses       - Get user businesses');
        console.log('  POST /api/businesses       - Create new business');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Manejo graceful de shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();