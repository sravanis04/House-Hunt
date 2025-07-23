const mongoose = require('mongoose');

const connectionOfDb = () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
      console.error(`❌ Could not connect to MongoDB: ${err}`);
      process.exit(1); // Exit the process with an error code
    });
};

module.exports = connectionOfDb;