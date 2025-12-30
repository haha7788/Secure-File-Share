const { app, initDirs } = require('./src/app');
const { PORT } = require('./src/config');
const { startCleanupScheduler } = require('./src/services');

initDirs().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ SecureFileShare Server started on port ${PORT}`);
    console.log('');

    startCleanupScheduler();
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});