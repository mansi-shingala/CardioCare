import React, { useState } from 'react';
import { predictRisk } from '../services/api';

const SAMPLE_HIGH_RISK = {
  age: 58,
  gender: 2, // Male
  height: 165,
  weight: 92,
  ap_hi: 150,
  ap_lo: 95,
  cholesterol: 3, // Well above normal
  gluc: 2, // Above normal
  smoke: 1, // Yes
  alco: 1, // Yes
  active: 0 // Inactive
};

const SAMPLE_LOW_RISK = {
  age: 40,
  gender: 1, // Female
  height: 162,
  weight: 58,
  ap_hi: 110,
  ap_lo: 70,
  cholesterol: 1, // Normal
  gluc: 1, // Normal
  smoke: 0, // No
  alco: 0, // No
  active: 1 // Active
};

function Predict() {
  const [formData, setFormData] = useState({
    age: 50,
    gender: 1,
    height: 165,
    weight: 68,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const loadPreset = (preset) => {
    setFormData(preset);
    setResult(null);
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setResult(null);

    try {
      // Send payload to FastAPI backend via Axios
      const data = await predictRisk(formData);
      setResult(data);
    } catch (err) {
      console.error('Prediction request failed:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setApiError(JSON.stringify(err.response.data.detail));
      } else {
        setApiError('Unable to connect to FastAPI backend on port 8001. Please ensure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
              <h2 className="fw-bold mb-1">🫀 Patient Risk Assessment</h2>
              <p className="text-muted small mb-0">
                Input clinical, examination, and lifestyle parameters to compute real-time cardiovascular disease risk.
              </p>
            </div>
            {/* Quick Demo Pre-fill buttons */}
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-danger fw-semibold"
                onClick={() => loadPreset(SAMPLE_HIGH_RISK)}
              >
                ⚡ Load High Risk Sample
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-success fw-semibold"
                onClick={() => loadPreset(SAMPLE_LOW_RISK)}
              >
                ✅ Load Low Risk Sample
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {apiError && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
              <span>⚠️</span>
              <div>{apiError}</div>
            </div>
          )}

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="custom-card p-4 p-md-5 mb-5">
            {/* Section 1: Demographics & Body Metrics */}
            <div className="mb-4">
              <div className="form-section-title">
                <span>👤</span> 1. Patient Demographics & Body Metrics
              </div>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label" htmlFor="age">Age (Years)</label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    min="18"
                    max="120"
                    className="form-control"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-hint">Patient age in years (18 - 100)</div>
                </div>

                <div className="col-md-3">
                  <label className="form-label" htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value={1}>Female</option>
                    <option value={2}>Male</option>
                  </select>
                  <div className="form-hint">Biological gender</div>
                </div>

                <div className="col-md-3">
                  <label className="form-label" htmlFor="height">Height (cm)</label>
                  <input
                    id="height"
                    type="number"
                    name="height"
                    min="100"
                    max="240"
                    className="form-control"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-hint">Height in centimeters</div>
                </div>

                <div className="col-md-3">
                  <label className="form-label" htmlFor="weight">Weight (kg)</label>
                  <input
                    id="weight"
                    type="number"
                    step="0.5"
                    name="weight"
                    min="30"
                    max="220"
                    className="form-control"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-hint">Weight in kilograms</div>
                </div>
              </div>
            </div>

            {/* Section 2: Blood Pressure Measurements */}
            <div className="mb-4">
              <div className="form-section-title">
                <span>🩺</span> 2. Blood Pressure Measurements
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="ap_hi">Systolic Blood Pressure (ap_hi)</label>
                  <input
                    id="ap_hi"
                    type="number"
                    name="ap_hi"
                    min="60"
                    max="240"
                    className="form-control"
                    value={formData.ap_hi}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-hint">Upper blood pressure reading in mm Hg (e.g. 120)</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="ap_lo">Diastolic Blood Pressure (ap_lo)</label>
                  <input
                    id="ap_lo"
                    type="number"
                    name="ap_lo"
                    min="40"
                    max="180"
                    className="form-control"
                    value={formData.ap_lo}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-hint">Lower blood pressure reading in mm Hg (e.g. 80)</div>
                </div>
              </div>
            </div>

            {/* Section 3: Biochemical Blood Tests */}
            <div className="mb-4">
              <div className="form-section-title">
                <span>🧪</span> 3. Biochemical Blood Tests
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="cholesterol">Cholesterol Level</label>
                  <select
                    id="cholesterol"
                    name="cholesterol"
                    className="form-select"
                    value={formData.cholesterol}
                    onChange={handleChange}
                  >
                    <option value={1}>1: Normal (&lt; 200 mg/dl)</option>
                    <option value={2}>2: Above Normal (200 - 239 mg/dl)</option>
                    <option value={3}>3: Well Above Normal (≥ 240 mg/dl)</option>
                  </select>
                  <div className="form-hint">Total serum cholesterol category</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="gluc">Glucose Level</label>
                  <select
                    id="gluc"
                    name="gluc"
                    className="form-select"
                    value={formData.gluc}
                    onChange={handleChange}
                  >
                    <option value={1}>1: Normal (&lt; 100 mg/dl)</option>
                    <option value={2}>2: Above Normal (100 - 125 mg/dl)</option>
                    <option value={3}>3: Well Above Normal (≥ 126 mg/dl)</option>
                  </select>
                  <div className="form-hint">Fasting blood glucose category</div>
                </div>
              </div>
            </div>

            {/* Section 4: Lifestyle & Behavioral Factors */}
            <div className="mb-4">
              <div className="form-section-title">
                <span>🏃</span> 4. Lifestyle & Behavioral Factors
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label" htmlFor="smoke">Smoking Status</label>
                  <select
                    id="smoke"
                    name="smoke"
                    className="form-select"
                    value={formData.smoke}
                    onChange={handleChange}
                  >
                    <option value={0}>Non-Smoker (0)</option>
                    <option value={1}>Smoker (1)</option>
                  </select>
                  <div className="form-hint">Current tobacco smoking</div>
                </div>

                <div className="col-md-4">
                  <label className="form-label" htmlFor="alco">Alcohol Consumption</label>
                  <select
                    id="alco"
                    name="alco"
                    className="form-select"
                    value={formData.alco}
                    onChange={handleChange}
                  >
                    <option value={0}>No (0)</option>
                    <option value={1}>Yes (1)</option>
                  </select>
                  <div className="form-hint">Regular alcohol consumption</div>
                </div>

                <div className="col-md-4">
                  <label className="form-label" htmlFor="active">Physical Activity</label>
                  <select
                    id="active"
                    name="active"
                    className="form-select"
                    value={formData.active}
                    onChange={handleChange}
                  >
                    <option value={1}>Physically Active (1)</option>
                    <option value={0}>Inactive / Sedentary (0)</option>
                  </select>
                  <div className="form-hint">Regular exercise or physical activity</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-primary-custom py-3 fs-5"
                disabled={loading}
              >
                {loading ? 'Analyzing Biomarkers...' : '🔍 Compute Disease Risk'}
              </button>
            </div>
          </form>

          {/* Result Presentation Card */}
          {result && (
            <div className={`p-4 p-md-5 mb-5 ${result.prediction === 1 ? 'result-card-danger' : 'result-card-success'}`}>
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <span className={result.prediction === 1 ? 'risk-badge-danger' : 'risk-badge-success'}>
                  {result.prediction === 1 ? '⚠️ High Risk Detected' : '✅ Low Risk Detected'}
                </span>
                <span className="text-muted fw-bold small">
                  Model: Random Forest Classifier
                </span>
              </div>

              <h3 className="fw-bold mb-2">
                {result.risk_level}
              </h3>

              {result.probability !== null && (
                <div className="my-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Predicted Disease Probability:</span>
                    <span className="fs-4 fw-extrabold text-dark">{result.probability}%</span>
                  </div>
                  <div className="progress" style={{ height: '14px', borderRadius: '999px', background: '#e2e8f0' }}>
                    <div
                      className={`progress-bar progress-bar-striped progress-bar-animated ${result.prediction === 1 ? 'bg-danger' : 'bg-success'}`}
                      role="progressbar"
                      style={{ width: `${result.probability}%` }}
                      aria-valuenow={result.probability}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              )}

              {/* Mandatory Medical Disclaimer */}
              <div className="p-3 bg-white bg-opacity-75 rounded-3 border mt-4">
                <div className="fw-bold text-dark small mb-1">
                  🩺 Medical & Educational Disclaimer:
                </div>
                <div className="small text-muted">
                  {result.disclaimer}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Predict;
