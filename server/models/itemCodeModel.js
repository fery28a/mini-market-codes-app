// server/models/itemCodeModel.js

const mongoose = require('mongoose');

const codeSchema = mongoose.Schema({
  // Tipe kode: 'baru', 'renceng', atau 'kiloan'
  type: {
    type: String,
    required: true,
    unique: true, // Pastikan hanya ada satu dokumen untuk setiap tipe
    enum: ['baru', 'renceng', 'kiloan'] // Hanya izinkan nilai ini
  },
  // Nomor urutan terakhir yang digunakan
  lastCodeNumber: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true // Menambahkan createdAt dan updatedAt
});

const ItemCode = mongoose.model('ItemCode', codeSchema);

module.exports = ItemCode;