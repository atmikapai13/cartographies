import React from 'react';

const Header: React.FC = () => (
  <nav className="navbar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
    {/* Header */}
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div className="nav-title" style={{ fontSize: '1.0rem', fontWeight: 1000, color: '#f8f6f0', fontFamily: 'Arial', fontStyle: 'normal', letterSpacing: '0.1rem', marginTop: '10px' }}>
        ATMIKA PAI
      </div>
    </div>
  </nav>
);

export default Header; 