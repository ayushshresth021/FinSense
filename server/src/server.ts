import 'dotenv/config';
import app from './app';



// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'ASSEMBLYAI_API_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(` Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log(' FinSense API Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` API URL: http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log(' Available endpoints:');
  console.log('  GET    /api/health');
  console.log('  GET    /api/transactions');
  console.log('  POST   /api/transactions');
  console.log('  POST   /api/transactions/parse');
  console.log('  POST   /api/transactions/voice');
  console.log('  PUT    /api/transactions/:id');
  console.log('  DELETE /api/transactions/:id');
  console.log('  GET    /api/insights');
  console.log('  GET    /api/insights/summary');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(' Unhandled Promise Rejection:', err);
  console.error('Shutting down server...');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error(' Uncaught Exception:', err);
  console.error('Shutting down server...');
  process.exit(1);
});