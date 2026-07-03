require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'supersecretjwtsecretkeychangeitinprod') {
  console.error('\n✗ [CRITICAL SECURITY ERROR]: JWT_SECRET environment variable is missing, empty, or using default insecure value.');
  console.error('✗ Server startup aborted due to critical security risk. Please configure a strong JWT_SECRET key in your .env file.\n');
  process.exit(1);
}

const connectDb = require('./libs/mongoose');
const app = require('./app');

async function initializeMongoDB() {
  try {
    await connectDb();
  } catch (error) {
    console.error('✗ Error initializing MongoDB connection:', error.message || error);
  }
}

initializeMongoDB();

const PORT = process.env.PORT || 6002;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
