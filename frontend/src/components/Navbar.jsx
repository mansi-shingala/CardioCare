import React, { useState, useEffect, useRef, useCallback } from 'react';
import { checkApiHealth } from '../services/api';

function Navbar({ activePage, setActivePage }) {
  const [apiOnline, setApiOnline] = useState(null); // null: checking, true: online, false: offline
  const [isChecking, setIsChecking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isCheckingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const checkStatus = useCallback(async (isSilent = false) => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    
    // Only show visible spinner/retrying label if not a silent background heartbeat
    if (!isSilent && isMountedRef.current) {
      setIsChecking(true);
    }

    try {
      await checkApiHealth(15000);
      if (isMountedRef.current) {
        setApiOnline(true);
      }
    } catch {
      if (isMountedRef.current) {
        setApiOnline(false);
      }
    } finally {
      isCheckingRef.current = false;
      if (isMountedRef.current && !isSilent) {
        setIsChecking(false);
      }
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkStatus(false);
  }, [checkStatus]);

  // Auto-polling:
  // - When offline or checking: auto-retry every 5 seconds until backend wakes up!
  // - When online: maintain a 30 second gentle background heartbeat.
  useEffect(() => {
    const pollInterval = apiOnline === true ? 30000 : 5000;
    const intervalId = setInterval(() => {
      // If already online, perform silent heartbeat; if offline, perform visible check
      checkStatus(apiOnline === true);
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [apiOnline, checkStatus]);

  const handleManualCheck = () => {
    checkStatus(false);
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <a 
          className="navbar-brand text-decoration-none" 
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
        >
          <span style={{ fontSize: '1.6rem' }}>🫀</span>
          <span>CardioCare </span>
        </a>

        <div className="d-flex align-items-center gap-2 order-lg-last">
          <button
            type="button"
            className="btn btn-sm d-flex align-items-center gap-2 px-2 py-1 rounded-pill border bg-light shadow-none api-status-btn"
            style={{ fontSize: '0.8rem', cursor: isChecking ? 'wait' : 'pointer' }}
            onClick={handleManualCheck}
            disabled={isChecking}
            title={
              apiOnline === true 
                ? 'API is online. Click to recheck.' 
                : 'API is offline or starting up (Render spins up on cold start). Click to check now.'
            }
          >
            <span 
              className={`rounded-circle ${
                isChecking
                  ? 'status-indicator-checking'
                  : apiOnline === true 
                  ? 'status-indicator-online' 
                  : apiOnline === false 
                  ? 'status-indicator-offline' 
                  : 'status-indicator-checking'
              }`} 
              style={{ 
                width: '8px', 
                height: '8px', 
                display: 'inline-block',
                backgroundColor: isChecking
                  ? '#f59e0b'
                  : apiOnline === true 
                  ? '#10b981' 
                  : apiOnline === false 
                  ? '#e11d48' 
                  : '#f59e0b' 
              }}
            />
            <span className="text-muted fw-semibold">
              {isChecking
                ? apiOnline === true
                  ? 'Checking...'
                  : apiOnline === false
                  ? 'Retrying...'
                  : 'Connecting...'
                : apiOnline === true
                ? 'API: Online'
                : apiOnline === false
                ? 'API: Offline'
                : 'API: Checking...'}
            </span>
            {isChecking ? (
              <span 
                className="spinner-border spinner-border-sm text-secondary" 
                style={{ width: '0.7rem', height: '0.7rem', borderWidth: '1.5px' }} 
                role="status" 
              />
            ) : (
              <span style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: 1 }}>↻</span>
            )}
          </button>

          {/* Mobile hamburger button */}
          <button 
            className="navbar-toggler border-0 p-1 d-lg-none" 
            type="button" 
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'predict' ? 'active' : ''}`}
                onClick={() => handleNavClick('predict')}
              >
                Predict Risk
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                Model Performance
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                About & Features
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
