import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import MapboxGlobe from './components/MapboxGlobe';
import Sidebar from './components/Sidebar';
import { asset } from './utils/assetPath';
import './App.css';

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [disclaimerPage, setDisclaimerPage] = useState(1);

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX');
    
    // Check if the user has seen the disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('hasSeenPortfolioDisclaimer');
    if (hasSeenDisclaimer) {
      setShowDisclaimer(false);
    }

    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // const handleShare = async () => {
  //   // Track share event
  //   ReactGA.event({
  //     category: 'Engagement',
  //     action: 'Share Portfolio',
  //     label: 'Mobile Share'
  //   });
    
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "Atmika's Portfolio",
  //         text: "Check out this interactive portfolio mapping projects across the globe!",
  //         url: window.location.href,
  //       });
  //     } catch (error) {
  //       console.error('Share failed:', error);
  //     }
  //   } else {
  //     navigator.clipboard.writeText(window.location.href);
  //     alert('Link copied to clipboard!');
  //   }
  // };

  const handleCitySelect = (city: string | null) => {
    if (city) {
      // Track city selection
      ReactGA.event({
        category: 'Navigation',
        action: 'Select City',
        label: city
      });
    }
    setSelectedCity(city);
  };

  // Disclaimer popup component
  const DisclaimerPopup = () => (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
    // Intentionally not closing on overlay click to guide through pages
    >
      <div 
        style={{ 
          background: '#151515', 
          color: '#f8f6f0', 
          padding: '20px',
          borderRadius: '16px',
          textAlign: 'center',
          width: '500px',
          maxWidth: '90vw',
          height: '420px',
          margin: '20px',
          border: '1px solid #333',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            ReactGA.event({
              category: 'Engagement',
              action: 'Close Disclaimer',
              label: 'Early Close'
            });
            setShowDisclaimer(false);
            localStorage.setItem('hasSeenPortfolioDisclaimer', 'true');
          }}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: '#aaa',
            fontSize: '1.5rem',
            cursor: 'pointer',
            lineHeight: 1,
            padding: 5
          }}
        >
          &times;
        </button>
        {/* Top: Globe */}
        <div style={{ fontSize: '3rem', flexShrink: 0 }}>🌍</div>

        {/* Middle: Dynamic Content */}
        <div className="disclaimer-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', padding: '10px 10px 0 10px', overflowY: 'auto', maxHeight: '300px' }}>
          {/* Mobile: Only show page 1 content */}
          {isMobile ? (
            <>
              <div style={{ fontSize: '1.0rem', fontWeight: 700, marginBottom: 8, color: '#a5d6fa' }}>
                Hello, World!<br />
                Welcome to Atmika's portfolio.
              </div>
              <div style={{ fontSize: '0.8rem', lineHeight: '1.4', marginBottom: 10, textAlign: 'center' }}>
                I'm a Cornell Tech grad student, studying Information Systems. GIS, Cartography, and AR/VR fascinate me! 
              </div>
              <div style={{ fontSize: '0.8rem', lineHeight: '1.4', marginBottom: 20, textAlign: 'center' }}>
                Jack Dangermond says, <span style={{ fontStyle: 'italic' , fontWeight: 600}}>"Location is a way to organize, index, and retrieve our memories."</span> I've lived in six cities (and counting), and each has shaped how I think. This portfolio traces those geographies. 
              </div>
            </>
          ) : (
            <>
              {/* Desktop: Show all pages based on disclaimerPage state */}
              {disclaimerPage === 1 && (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8, color: '#a5d6fa' }}>
                    Hello, World!<br />
                    Welcome to Atmika's portfolio.
                  </div>
                  <div style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: 10, textAlign: 'center' }}>
                    I'm a Cornell Tech grad student, studying Information Systems. GIS, Cartography, and AR/VR fascinate me! 
                  </div>
                  <div style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: 20, textAlign: 'center' }}>
                    Jack Dangermond says, <span style={{ fontStyle: 'italic' , fontWeight: 600}}>"Location is a way to organize, index, and retrieve our memories."</span> I've lived in six cities (and counting), and each has shaped how I think. This portfolio traces those geographies. 
                  </div>
                </>
              )}

              {disclaimerPage === 2 && (
                <>
                  <div style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: 5, textAlign: 'center', marginTop: 0, fontStyle: 'italic' }}>
                    Here are the controls on the map:
                  </div>
                  
                  <div className="disclaimer-controls" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', overflowY: 'auto', maxHeight: '250px' }}>
                    {/* Map Cities Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(165, 214, 250, 0.2)' }}>
                      <img src={asset('assets/map-cities.png')} alt="Cities" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#a5d6fa', marginBottom: '4px' }}>Cities Dropdown</div>
                        <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>Click to see a list of cities and jump directly to any location</div>
                      </div>
                    </div>

                    {/* Map Tour Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(165, 214, 250, 0.2)' }}>
                      <img src={asset('assets/map-tour.png')} alt="Tour" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#a5d6fa', marginBottom: '4px' }}>Guided Tour</div>
                        <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>Take a guided tour of my career thus far</div>
                      </div>
                    </div>

                    {/* Map Camera Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(165, 214, 250, 0.2)' }}>
                      <img src={asset('assets/map-3d.png')} alt="3D" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#a5d6fa', marginBottom: '4px' }}>3D Toggle</div>
                        <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>Switch between 2D and 3D view</div>
                      </div>
                    </div>

                    {/* Map Music Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(165, 214, 250, 0.2)' }}>
                      <img src={asset('assets/map-music.png')} alt="Music" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#a5d6fa', marginBottom: '4px' }}>My Curated Playlists</div>
                          <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>Explore curated playlists for each city!</div>
                        </div>
                    </div>
                  </div>
                </>
              )}

              {disclaimerPage === 3 && (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#a5d6fa' }}>
                    Ready to explore?
                  </div>
                  
                  <div style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: 24, textAlign: 'center', fontStyle: 'italic' }}>
                    Take a journey through all the cities I have had the opportunity to live and work in!
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div 
                      onClick={() => {
                        // Close the disclaimer first
                        ReactGA.event({
                          category: 'Engagement',
                          action: 'Complete Disclaimer',
                          label: 'Guided Tour Highlight'
                        });
                        setShowDisclaimer(false);
                        localStorage.setItem('hasSeenPortfolioDisclaimer', 'true');
                        
                        // Then trigger the guided tour by simulating a click on map-tour.png
                        setTimeout(() => {
                          const tourButton = document.querySelector(`img[src="${asset('assets/map-tour.png')}"]`) as HTMLImageElement;
                          if (tourButton) {
                            tourButton.click();
                          }
                        }, 100); // Small delay to ensure modal closes first
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        background: 'rgba(165, 214, 250, 0.2)',
                        borderRadius: '12px',
                        border: '2px solid rgba(165, 214, 250, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(165, 214, 250, 0.3)',
                        animation: 'pulse 2s infinite'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(165, 214, 250, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(165, 214, 250, 0.8)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(165, 214, 250, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(165, 214, 250, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(165, 214, 250, 0.6)';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(165, 214, 250, 0.3)';
                      }}
                    >
                      <img src={asset('assets/map-tour.png')} alt="Guided Tour" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#a5d6fa' }}>Start Guided Tour</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

        </div>

        {/* Bottom: Navigation - Desktop only */}
        {!isMobile && (
          <div style={{
            flexShrink: 0, 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '0 10px',
            boxSizing: 'border-box'
          }}>
            {/* Back Arrow */}
            <button 
              style={{
                background: 'none',
                border: 'none',
                color: '#f8f6f0',
                fontSize: '2rem',
                cursor: 'pointer',
                visibility: disclaimerPage === 1 ? 'hidden' : 'visible',
                padding: '10px'
              }}
              onClick={() => setDisclaimerPage(disclaimerPage - 1)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            {/* Pagination Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <span style={{ height: '8px', width: '8px', backgroundColor: disclaimerPage === 1 ? '#a5d6fa' : '#555', borderRadius: '50%' }}></span>
              <span style={{ height: '8px', width: '8px', backgroundColor: disclaimerPage === 2 ? '#a5d6fa' : '#555', borderRadius: '50%' }}></span>
              <span style={{ height: '8px', width: '8px', backgroundColor: disclaimerPage === 3 ? '#a5d6fa' : '#555', borderRadius: '50%' }}></span>
            </div>

            {/* Forward Arrow */}
            <button 
              style={{
                background: 'none',
                border: 'none',
                color: '#a5d6fa',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '10px'
              }}
              onClick={() => {
                if (disclaimerPage === 3) {
                  ReactGA.event({
                    category: 'Engagement',
                    action: 'Complete Disclaimer',
                    label: 'Full Flow'
                  });
                  setShowDisclaimer(false);
                  localStorage.setItem('hasSeenPortfolioDisclaimer', 'true');
                } else {
                  setDisclaimerPage(disclaimerPage + 1);
                }
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}

        {/* Mobile: Only show close button */}
        {isMobile && (
          <div style={{
            flexShrink: 0, 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '0 10px',
            boxSizing: 'border-box'
          }}>
            <button 
              style={{
                background: '#a5d6fa',
                border: 'none',
                color: '#000',
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
              onClick={() => {
                ReactGA.event({
                  category: 'Engagement',
                  action: 'Complete Disclaimer',
                  label: 'Mobile Close'
                });
                setShowDisclaimer(false);
                localStorage.setItem('hasSeenPortfolioDisclaimer', 'true');
              }}
            >
              Get Started
            </button>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <>
      <div style={{ opacity: showDisclaimer ? 0.7 : 1, transition: 'opacity 0.3s ease' }}>
      {/* Navigation Bar */}
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {/* Header */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="nav-title" style={{ fontSize: '1.0rem', fontWeight: 1000, color: '#f8f6f0', fontFamily: 'Arial', fontStyle: 'normal', letterSpacing: '0.2rem', marginTop: '10px' }}>
            ATMIKA PAI
          </div>
        </div>
      </nav>
      {/* Main content: Map and Sidebar */}
      <div className="main-content">
        <div className="map-wrapper">
          <MapboxGlobe selectedCity={selectedCity} onCitySelect={handleCitySelect} showDisclaimer={showDisclaimer} />
        </div>
        <Sidebar selectedCity={selectedCity} setSelectedCity={handleCitySelect} />
      </div>
      {/* Moved nav-links below the map/sidebar */}
      
      {/* Footer */}
      <footer className="footer" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.04)', padding: '2px 0' }}>
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
      </div>
      {showDisclaimer && <DisclaimerPopup />}
    </>
  );
}

export default App;
