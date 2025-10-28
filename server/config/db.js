// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Memastikan process.env.MONGO_URI tersedia dan berupa string
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in the environment variables.');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Log pesan sukses
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log pesan error dan hentikan proses jika koneksi gagal
    console.error(`Error: ${error.message}`);
    
    // Hentikan proses Node.js dengan kode kegagalan (1)
    process.exit(1);
  }
};

module.exports = connectDB;