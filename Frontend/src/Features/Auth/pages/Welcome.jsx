import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import './Welcome.css';

// High-quality fashion model images from Unsplash
const MODEL_IMAGES = [
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&q=90&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=90&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=90&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1920&q=90&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=90&auto=format&fit=crop',
];

const SLIDE_INTERVAL = 5000; // 5 seconds per slide

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MODEL_IMAGES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Trigger mount animation
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleExplore = () => {
    navigate('/register');
  };

  const handleSellerAccess = () => {
    navigate('/register');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      {/* ===== BACKGROUND IMAGE SLIDESHOW ===== */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {MODEL_IMAGES.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`fashion-model-${index}`}
            className={`welcome-bg-image ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* ===== DARK GRADIENT OVERLAY ===== */}
      <div className="welcome-overlay" />

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {/* TOP TAGLINE */}
        <p
          className="welcome-tagline"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 400,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#d4af8a',
            marginBottom: '1rem',
          }}
        >
          A New Era of Street Couture
        </p>

        {/* BRAND NAME */}
        <h1 className="welcome-brand">Vexto</h1>

        {/* GOLDEN DIVIDER */}
        <div
          className="welcome-divider"
          style={{ maxWidth: '300px', width: '100%' }}
        />

        {/* DESCRIPTION */}
        <p className="welcome-description" style={{ marginBottom: '2.5rem' }}>
          Where bold streetwear meets editorial luxury.
          <br />
          Discover curated collections for those who dare to stand out —
          <br />
          built for buyers, <em>designed for visionaries.</em>
        </p>

        {/* CTA BUTTONS */}
        <div
          className="welcome-buttons"
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            id="welcome-explore-btn"
            className="btn-primary"
            onClick={handleExplore}
          >
            Explore Collection
          </button>
          <button
            id="welcome-seller-btn"
            className="btn-secondary"
            onClick={handleSellerAccess}
          >
            {user?.role === 'seller' ? 'Seller Dashboard' : 'Become a Seller'}
          </button>
        </div>

        {/* PLATFORM HIGHLIGHTS */}
        <div
          className="features-bar"
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '3.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { icon: '✦', label: 'Premium Drops' },
            { icon: '✦', label: 'Verified Sellers' },
            { icon: '✦', label: 'Exclusive Styles' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: '#d4af8a', fontSize: '0.5rem' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ===== SLIDE DOTS (Bottom Center) ===== */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 20,
        }}
      >
        {MODEL_IMAGES.map((_, index) => (
          <div
            key={index}
            className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            style={{ borderRadius: '2px', transition: 'all 0.4s ease' }}
          />
        ))}
      </div>

      {/* ===== SCROLL INDICATOR (Bottom) ===== */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          textAlign: 'center',
        }}
      >
        Scroll to Discover
      </div>

      {/* ===== CORNER BRANDING ===== */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: '36px',
          zIndex: 20,
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 400,
        }}
      >
        {user ? `Welcome, ${user.name?.split(' ')[0] || user.email?.split('@')[0]}` : 'Vexto'}
      </div>

      {/* ===== TOP RIGHT NAV ===== */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '36px',
          zIndex: 20,
          display: 'flex',
          gap: '28px',
        }}
      >
        {[
          { label: 'New', action: handleExplore },
          { label: 'Collections', action: handleExplore },
          { label: 'Account', action: () => navigate('/login') },
        ].map((nav) => (
          <button
            key={nav.label}
            onClick={nav.action}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'white')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.75)')}
          >
            {nav.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
