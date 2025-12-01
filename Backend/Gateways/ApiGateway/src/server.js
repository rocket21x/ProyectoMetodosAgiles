import app from './app.js';
import dotenv from 'dotenv';
import { getServiceStatus } from './config/services.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('🚀 Starting API Gateway...');
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔐 Auth Enabled: ${process.env.AUTH_ENABLED === 'true'}`);
    
    app.listen(PORT, async () => {
      console.log(`\n✅ API Gateway running on http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Info: http://localhost:${PORT}/api\n`);
      
      // Mostrar estado de servicios
      console.log('📋 Configured Services:');
      const services = getServiceStatus();
      services.forEach(service => {
        console.log(`   ${service.name}: ${service.url}`);
      });
      
      if (process.env.AUTH_ENABLED !== 'true') {
        console.log('\n⚠️  Running in MOCK AUTH mode');
        console.log(`   Mock User ID: ${process.env.MOCK_USER_ID}`);
        console.log(`   Mock User Role: ${process.env.MOCK_USER_ROLE}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start API Gateway:', error.message);
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