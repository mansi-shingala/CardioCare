import React from 'react';

function Home({ setActivePage }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-light text-primary px-3 py-2 rounded-pill fw-bold mb-3">
                🤖 Machine Learning & Healthcare
              </span>
              <h1 className="hero-title mb-3">
                Cardiovascular Disease Risk Prediction
              </h1>
              <p className="hero-subtitle mb-4">
                An intelligent, end-to-end full-stack machine learning system that analyzes 
                11 clinical and lifestyle patient biomarkers to evaluate the risk of cardiovascular disease in real time.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button 
                  className="btn btn-primary-custom"
                  onClick={() => setActivePage('predict')}
                >
                  ⚡ Start Prediction
                </button>
                <button 
                  className="btn btn-outline-light px-4 py-2 rounded-3 fw-semibold"
                  onClick={() => setActivePage('dashboard')}
                >
                  📊 View Model Metrics
                </button>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-lg p-4 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <h5 className="text-white fw-bold mb-3">System Architecture</h5>
                <div className="d-flex flex-column gap-3 text-light small">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="fw-bold text-info">1. Frontend Client</div>
                    <div>React + Vite + Bootstrap with responsive form validation</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="fw-bold text-warning">2. RESTful Backend</div>
                    <div>FastAPI with Pydantic validation & CORS handling</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="fw-bold text-success">3. ML Inference Engine</div>
                    <div>StandardScaler + Random Forest Classifier (saved with joblib)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Features Section */}
      <section className="container my-5 py-3">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold">
            Project Overview
          </span>
          <h2 className="fw-bold mt-2">Why This Project Stands Out</h2>
          <p className="text-muted">Designed for clarity, real-world data science rigor, and academic presentation.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="custom-card p-4 h-100">
              <div className="fs-1 mb-3">📈</div>
              <h5 className="fw-bold">Validated 73.2% Accuracy</h5>
              <p className="text-muted small">
                Evaluated on 13,724 hold-out test samples from the 70,000-record cardio_train dataset using stratified splitting.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="custom-card p-4 h-100">
              <div className="fs-1 mb-3">⚖️</div>
              <h5 className="fw-bold">Consistent Preprocessing</h5>
              <p className="text-muted small">
                Uses the exact <code>StandardScaler</code> fitted during training. Saved via <code>joblib</code> and applied identically in FastAPI.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="custom-card p-4 h-100">
              <div className="fs-1 mb-3">🩺</div>
              <h5 className="fw-bold">11 Key Biomarkers</h5>
              <p className="text-muted small">
                Covers systolic & diastolic blood pressure, cholesterol, glucose, body mass (height/weight), and lifestyle factors.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="disclaimer-banner mt-5">
          <div className="d-flex align-items-center gap-3">
            <span className="fs-3">⚠️</span>
            <div>
              <strong>Academic & Educational Demonstration Notice:</strong>
              <div className="small mt-1">
                This cardiovascular disease prediction tool is created solely for research and educational purposes. 
                It is <strong>not</strong> intended to diagnose, prevent, or treat any medical condition. Always seek the advice of a qualified physician with any health questions.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
