import React from 'react';
import { asset } from '../utils/assetPath';

const Footer: React.FC = () => (
  <footer className="footer" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
      <a href="https://www.linkedin.com/in/atmikapai/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
          <rect width="24" height="24" rx="4" fill="#181818"/>
          <path d="M6.94 19V9.5H4V19h2.94zM5.47 8.27a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42zM20 19h-2.93v-4.7c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V19H10V9.5h2.82v1.3h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.47V19z" fill="#fff"/>
        </svg>
      </a>
      <a href="https://github.com/atmikapai13" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#f5f5e6" style={{ verticalAlign: 'middle' }}>
        <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.207 11.387c.6.11.793-.26.793-.577v-2.04c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.204.085 1.837 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.42-1.304.763-1.604-2.665-.306-5.467-1.332-5.467-5.931 0-1.31.468-2.381 1.236-3.221-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.53 11.53 0 013.003-.404c1.02.004 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.242 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.623-5.479 5.921.431.372.815 1.104.815 2.225v3.293c0 .319.192.694.8.576A12.005 12.005 0 0024 12c0-6.627-5.373-12-12-12z"/>
      </svg>
      </a>
      <a href="https://medium.com/@atmikapai" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1043.63 592.71" fill="#f5f5e6" style={{ verticalAlign: 'middle' }}><g><path d="M588.67 296.14c0 163.51-131.29 296.13-293.33 296.13S2 459.65 2 296.14 133.29 0 295.33 0s293.34 132.63 293.34 296.14z"/><ellipse cx="873.5" cy="296.14" rx="170.13" ry="282.24"/><path d="M1041.63 296.14c0 155.94-76.13 282.24-170.13 282.24s-170.13-126.3-170.13-282.24S777.5 13.9 871.5 13.9s170.13 126.3 170.13 282.24z"/></g></svg>
      </a>
      <a href="mailto:atmikapai13@gmail.com" style={{fontSize: '1em', color: '#f5f5e6', textDecoration: 'none', display: 'flex', alignItems: 'center', marginTop: '10px'}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5f5e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
      </a>
      <a href={asset('assets/AtmikaPai_Resume.pdf')} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px'}} title="View Resume">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f5f5e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><polyline points="8,6 16,6"/><polyline points="8,10 16,10"/><polyline points="8,14 12,14"/></svg>
      </a>
    </div>
  </footer>
);

export default Footer; 