const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

async function connect() {
  const user = process.env.USER_DB_MONGO;
  const password = process.env.PASSWORD_DB_MONGO;
  const dbname = process.env.NAME_CONTAINER_DB_MONGO || 'ceiba-mercadoexpress';
  const cluster = process.env.CLUSTER_DB_MONGO;

  let uri;
  if (user && password && cluster) {
    uri = `mongodb+srv://${user}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`;
  } else {
    // Fallback to local MongoDB URI
    uri = process.env.MONGO_URI || `mongodb://localhost:27017/${dbname}`;
  }

  await mongoose.connect(uri);
  console.log(`✓ MongoDB connected successfully to database: ${dbname}`);
}

module.exports = connect;
