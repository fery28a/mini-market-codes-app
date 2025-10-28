// server/routes/codeRoutes.js

const express = require('express');
const ItemCode = require('../models/itemCodeModel');
const router = express.Router(); 

// --- Fungsi Bantuan untuk Logika Kode ---

const getCodeLogics = (type) => {
  switch (type) {
    case 'baru': return { prefix: 'IT', startNumber: 64700, padLength: 5 };
    case 'renceng': return { prefix: '', startNumber: 335208, padLength: 0 };
    case 'kiloan': return { prefix: '', startNumber: 4455, padLength: 0 };
    default: throw new Error(`Invalid code type: ${type}`);
  }
};

const formatCode = (type, sequence) => {
    const { prefix, startNumber, padLength } = getCodeLogics(type);
    
    // Urutan (sequence) 1 akan menghasilkan startNumber.
    // Urutan 2 akan menghasilkan startNumber + 1.
    const itemNumber = startNumber + sequence - 1; 

    return prefix + itemNumber.toString().padStart(padLength, '0');
}

// ---------------------------------------------------------------------
// ENDPOINT 1: GET CURRENT CODE (MEMBACA TANPA INCREMENT)
// ---------------------------------------------------------------------

router.get('/current/:type', async (req, res) => {
    const { type } = req.params;
    try {
        const codeDoc = await ItemCode.findOne({ type });
        
        // Jika dokumen belum ada, urutan dianggap 1 (untuk mendapatkan kode awal)
        const currentSequence = codeDoc ? codeDoc.lastCodeNumber : 1; 

        const code = formatCode(type, currentSequence);

        res.json({ code });
    } catch (error) {
        console.error(`Error fetching current code for ${type}:`, error.message);
        res.status(400).json({ 
            message: `Failed to retrieve current code: ${error.message}`
        });
    }
});

// ---------------------------------------------------------------------
// ENDPOINT 2: POST NEXT CODE (INCREMENT DAN MEMBACA KODE BERIKUTNYA)
// ---------------------------------------------------------------------

// Menggunakan POST untuk operasi modifikasi data (increment)
router.post('/next/:type', async (req, res) => {
    const { type } = req.params;
    try {
        // Operasi DB: $inc: 1 dilakukan. codeDoc mengembalikan nilai SETELAH peningkatan.
        const codeDoc = await ItemCode.findOneAndUpdate(
            { type },
            { $inc: { lastCodeNumber: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // 💡 KOREKSI: Gunakan lastCodeNumber yang sudah di-increment.
        // lastCodeNumber saat ini adalah N+1. Ini adalah kode berikutnya yang benar.
        const nextSequence = codeDoc.lastCodeNumber;

        const nextCode = formatCode(type, nextSequence);

        // API mengembalikan kode yang siap disalin pada klik berikutnya.
        res.json({ code: nextCode });

    } catch (error) {
        console.error(`Error generating next code for ${type}:`, error.message);
        res.status(400).json({ 
            message: `Failed to generate next code: ${error.message}`
        });
    }
});

module.exports = router;