import React from 'react';

function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <h6 className="text-white fw-bold mb-2">🫀 CardioCare ML Prediction System</h6>
            <p className="small mb-0" style={{ color: '#94a3b8' }}>
              Full-Stack Machine Learning project built with React, Vite, FastAPI, and Scikit-Learn.
              Trained on actual clinical cardiovascular data with 73.2% validated test accuracy.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-inline-block text-start p-3 rounded-3" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <span className="badge bg-warning text-dark mb-1">⚠️ Medical Disclaimer</span>
              <p className="small mb-0 text-light" style={{ fontSize: '0.78rem' }}>
                This software is intended strictly for <strong>educational and research purposes</strong>. 
                It is <strong>NOT</strong> a certified medical diagnosis and must never be used to replace professional medical advice.
              </p>
            </div>
          </div>
        </div>
        <hr className="my-4" style={{ borderColor: '#334155' }} />
        <div className="d-flex flex-wrap justify-content-between align-items-center small text-muted">
          <span>&copy; {new Date().getFullYear()} CardioCare ML Project. All rights reserved.</span>
          <span>FastAPI Backend • React Frontend • Scikit-Learn Pipeline</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
