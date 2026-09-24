import React, { useState, useEffect } from 'react';
import { checkApiHealth } from '../services/api';

function Navbar({ activePage, setActivePage }) {
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    checkApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <a 
          className="navbar-brand text-decoration-none" 
          href="#home"
          onClick={(e) => { e.preventDefault(); setActivePage('home'); }}
        >
          <span style={{ fontSize: '1.6rem' }}>🫀</span>
          <span>CardioCare </span>
          
        </a>

        <div className="d-flex align-items-center gap-3 order-lg-last">
          <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill border bg-light" style={{ fontSize: '0.8rem' }}>
            <span 
              className="rounded-circle" 
              style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: apiOnline === true ? '#10b981' : apiOnline === false ? '#e11d48' : '#f59e0b' 
              }}
            />
            <span className="text-muted fw-semibold">
              API: {apiOnline === true ? 'Connected' : apiOnline === false ? 'Offline (Port 8001)' : 'Checking...'}
            </span>
          </div>
        </div>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => setActivePage('home')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'predict' ? 'active' : ''}`}
                onClick={() => setActivePage('predict')}
              >
                Predict Risk
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActivePage('dashboard')}
              >
                Model Performance
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'about' ? 'active' : ''}`}
                onClick={() => setActivePage('about')}
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
