// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const connectDB = require('./config/db'); // Import fungsi koneksi DB
const codeRoutes = require('./routes/codeRoutes'); // Import router API

// ---------------------------------------------------------------------
// KONFIGURASI AWAL
// ---------------------------------------------------------------------

// Muat variabel lingkungan dari file .env. HARUS di awal.
dotenv.config();

// Panggil fungsi koneksi database (asynchronous)
connectDB(); 

const app = express();

// ---------------------------------------------------------------------
// MIDDLEWARE
// ---------------------------------------------------------------------

// Middleware CORS: Mengizinkan frontend (Vite) untuk mengakses backend.
app.use(cors({
    // Menggunakan CLIENT_URL dari .env untuk keamanan
    origin: process.env.CLIENT_URL || 'http://localhost:5173' 
})); 

// Middleware untuk mem-parsing body permintaan JSON
app.use(express.json());

// ---------------------------------------------------------------------
// ROUTES
// ---------------------------------------------------------------------

// Route default untuk menguji apakah server berjalan
app.get('/', (req, res) => {
  res.send('API Mini Market Code Generator is running successfully...');
});

// Route terpusat untuk semua operasi kode item
// Semua endpoint di codeRoutes akan diawali dengan /api/codes
app.use('/api/codes', codeRoutes);

// ---------------------------------------------------------------------
// START SERVER
// ---------------------------------------------------------------------

// Menggunakan PORT dari .env (seharusnya 8087) atau default 5000
const PORT = process.env.PORT || 5000; 

// Server mendengarkan port yang ditentukan
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));