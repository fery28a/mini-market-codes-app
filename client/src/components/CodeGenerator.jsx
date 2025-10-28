// client/src/components/CodeGenerator.jsx

import React, { useState, useEffect } from 'react';
import { getCurrentCode, getNextCode } from '../api/api'; 

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
      setMessage('Gagal terhubung ke Server API (Port 8087). Pastikan server berjalan.');
    }
  };

  useEffect(() => {
    fetchCode(); 
  }, [type]);

  // Fungsi Copy dan Ganti Kode
  const handleCopy = async () => {
    // Cek status processing
    if (isProcessing || currentCode.includes('ERROR') || currentCode === 'Loading...') {
      return;
    }
    
    setIsProcessing(true); 

    try {
      // 1. Salin Kode
      await navigator.clipboard.writeText(currentCode);
      setIsCopied(true); 
      setMessage(`Kode ${currentCode} telah disalin! Meminta kode berikutnya...`);
      
      // 2. Panggil getNextCode (POST, satu kali increment)
      const nextCode = await getNextCode(type);
      
      // 3. Update state
      setTimeout(() => {
        setCurrentCode(nextCode);
        setIsCopied(false); 
        setIsProcessing(false); 
        setMessage(`Kode baru (${nextCode}) siap disalin. Kode sebelumnya telah disalin.`);
      }, 500); 

    } catch (err) {
      console.error('Copy failed:', err);
      setIsProcessing(false); 
      setMessage('Gagal menyalin atau API gagal menghasilkan kode berikutnya.');
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
      
      {/* Kotak Kode */}
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