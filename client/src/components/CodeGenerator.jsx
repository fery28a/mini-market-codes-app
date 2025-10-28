// client/src/components/CodeGenerator.jsx

import React, { useState, useEffect } from 'react';
// Pastikan path ini benar untuk dua fungsi API yang terpisah
import { getCurrentCode, getNextCode } from '../api/api'; 

// Fungsi fallback untuk menyalin jika navigator.clipboard tidak tersedia (saat menggunakan HTTP)
const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  
    textArea.style.opacity = 0;          
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        // Metode penyalinan lama yang bekerja di konteks non-HTTPS
        const successful = document.execCommand('copy');
        if (!successful) {
            throw new Error("Failed using document.execCommand");
        }
    } catch (err) {
        document.body.removeChild(textArea);
        throw err;
    }
    document.body.removeChild(textArea);
};

const CodeGenerator = ({ type, title, color }) => {
  const [currentCode, setCurrentCode] = useState('Loading...');
  const [message, setMessage] = useState('Mengambil kode saat ini...');
  const [isCopied, setIsCopied] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 

  const fetchCode = async () => {
    setMessage('Mengambil kode saat ini dari database...');
    try {
      const code = await getCurrentCode(type); 
      setCurrentCode(code);
      setMessage(`Kode ${code} siap disalin.`);
    } catch (err) {
      setCurrentCode('--- ERROR ---');
      setMessage('Gagal terhubung ke Server API (Port 8087). Pastikan Nginx/PM2 berjalan.');
    }
  };

  useEffect(() => {
    fetchCode(); 
  }, [type]);

  // Fungsi Copy dan Ganti Kode
  const handleCopy = async () => {
    if (isProcessing || currentCode.includes('ERROR') || currentCode === 'Loading...') {
      return;
    }
    
    setIsProcessing(true); 

    try {
        // 1. Salin Kode (Menggunakan Fallback jika navigator.clipboard undefined)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Metode modern (HTTPS)
            await navigator.clipboard.writeText(currentCode);
        } else {
            // Metode fallback (HTTP) - Mengatasi TypeError
            fallbackCopyTextToClipboard(currentCode); 
        }
        
        // Salinan berhasil, lanjutkan ke API
        setIsCopied(true); 
        setMessage(`Kode ${currentCode} telah disalin! Meminta kode berikutnya...`);
        
    } catch (err) {
        console.error('Copy failed:', err);
        setIsProcessing(false); 
        setMessage('Gagal menyalin. Silakan coba metode salin manual atau aktifkan HTTPS.');
        return; // Hentikan proses jika salin gagal
    }
    
    // --- Lanjutkan ke Peningkatan Kode (API) ---
    try {
      const nextCode = await getNextCode(type); // Panggilan POST untuk increment
      
      // Update state setelah delay singkat
      setTimeout(() => {
        setCurrentCode(nextCode);
        setIsCopied(false); 
        setIsProcessing(false); 
        setMessage(`Kode baru (${nextCode}) siap disalin. Kode sebelumnya telah disalin.`);
      }, 500); 

    } catch (err) {
      console.error('API failed:', err);
      setIsProcessing(false); 
      setMessage('API gagal menghasilkan kode berikutnya, meskipun salinan berhasil.');
    }
  };

  return (
    <div style={{ 
      padding: '25px', 
      border: `2px solid ${color}`, 
      borderRadius: '10px', 
      backgroundColor: '#ffffff', 
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      transform: isCopied ? 'scale(1.02)' : 'scale(1)' 
    }}>
      <h3 style={{ marginTop: '0', color: color, borderBottom: `2px solid ${color}30`, paddingBottom: '10px' }}>{title}</h3>
      
      {/* Kotak Kode (Lebih Besar & Interaktif) */}
      <div style={{ 
        marginBottom: '20px', 
        fontSize: '2.5em', 
        fontWeight: '900', 
        padding: '20px 15px', 
        borderRadius: '8px',
        backgroundColor: isCopied ? color + '20' : '#f8f8f8', 
        color: isCopied ? color : '#333',
        textAlign: 'center',
        border: '1px solid #ccc',
        transition: 'all 0.3s ease'
      }}>
        {currentCode}
      </div>
      
      {/* Tombol Kontras dan Full-Width */}
      <button 
        onClick={handleCopy} 
        disabled={isProcessing || currentCode.includes('ERROR') || currentCode === 'Loading...'} 
        style={{ 
          width: '100%',
          padding: '15px', 
          backgroundColor: isCopied ? '#6c757d' : color, 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: isProcessing ? 'not-allowed' : 'pointer', 
          fontSize: '1.1em',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease, opacity 0.3s ease',
          opacity: (isProcessing || currentCode.includes('ERROR') || currentCode === 'Loading...') ? 0.6 : 1
        }}
      >
        {isCopied 
            ? '✅ BERHASIL DISALIN! Mengganti...' 
            : isProcessing 
            ? '⏳ Memproses...'
            : `COPY `}
      </button>
      
      {/* Pesan Status */}
      <p style={{ 
        marginTop: '15px', 
        fontSize: '0.9em', 
        color: currentCode.includes('ERROR') ? 'red' : (isCopied ? color : '#6c757d') 
      }}>
        {message}
      </p>
    </div>
  );
};

export default CodeGenerator;
