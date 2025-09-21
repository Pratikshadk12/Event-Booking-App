// Fallback entry point for deployment platforms that expect index.js
// This simply requires and starts the main server.js file

console.log('🚀 Starting EventHive Backend via index.js fallback...');

try {
  require('./server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}