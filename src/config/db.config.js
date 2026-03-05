const mongoose = require('mongoose');

const connectDb = async () => {
  // pick up connection string from environment or fall back to localhost
  const uri = process.env.MONGO_URI ;

  try {
    // mongoose 6+ uses new parser and topology by default; options removed
    await mongoose.connect(uri);
    console.log(`MongoDb connected to `);
  } catch (error) {
    console.error('MongoDB connection failed:');
    console.error(error); 
    console.error('Please check that MONGO_URI is set correctly in your .env or that a local MongoDB instance is running.');
    process.exit(1);
  }
};

module.exports = connectDb;
