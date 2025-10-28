// client/src/App.jsx

import React from 'react';
import CodeGenerator from './components/CodeGenerator'; 

function App() {
  return (
    // Container utama full-width. Margin dan padding sudah dihilangkan oleh index.css
    <div style={{ padding: '0', margin: '0', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      
      {/* Header Biru yang Kontras dan Full-Width */}
      <header style={{ 
        backgroundColor: '#007bff', 
        color: 'white', 
        padding: '25px 50px', // Padding horizontal 50px
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
      }}>
       
        
      </header>
      
      {/* Container Generator: Menggunakan Grid untuk tampilan full-width responsif */}
      <div style={{ 
        padding: '40px 50px', // Padding horizontal 50px untuk memberi ruang di kiri/kanan
        display: 'grid', 
        // Mengatur grid: minimal 320px, selebihnya dibagi rata (1fr)
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
          
          {/* 1. KODE ITEM BARU (Biru) */}
          <CodeGenerator 
            type="baru" 
            title="1. KODE ITEM BARU"
            color="#007bff" 
          />

          {/* 2. KODE ITEM RENCENG (Hijau) */}
          <CodeGenerator 
            type="renceng" 
            title="2. KODE RENCENG & BARCODE ECER"
            color="#28a745" 
          />
          
          {/* 3. KODE ITEM KILOAN (Merah) */}
          <CodeGenerator 
            type="kiloan" 
            title="3. KODE KILOAN"
            color="#dc3545" 
          />
          
      </div>

      <footer style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e9ecef', color: '#6c757d', borderTop: '1px solid #dee2e6' }}>
        
      </footer>
    </div>
  );
}

export default App;