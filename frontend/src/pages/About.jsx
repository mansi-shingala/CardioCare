import React from 'react';

function About() {
  const featuresList = [
    { name: 'age', type: 'Numeric', desc: 'Age of the patient in years (18 - 100).' },
    { name: 'gender', type: 'Categorical', desc: 'Biological sex (1 = Female, 2 = Male).' },
    { name: 'height', type: 'Numeric', desc: 'Height in centimeters (cm).' },
    { name: 'weight', type: 'Numeric', desc: 'Body weight in kilograms (kg).' },
    { name: 'ap_hi', type: 'Numeric', desc: 'Systolic blood pressure in mm Hg.' },
    { name: 'ap_lo', type: 'Numeric', desc: 'Diastolic blood pressure in mm Hg.' },
    { name: 'cholesterol', type: 'Categorical', desc: 'Cholesterol level (1: Normal, 2: Above Normal, 3: Well Above Normal).' },
    { name: 'gluc', type: 'Categorical', desc: 'Fasting glucose level (1: Normal, 2: Above Normal, 3: Well Above Normal).' },
    { name: 'smoke', type: 'Binary', desc: 'Current tobacco smoking status (0 = No, 1 = Yes).' },
    { name: 'alco', type: 'Binary', desc: 'Alcohol consumption habit (0 = No, 1 = Yes).' },
    { name: 'active', type: 'Binary', desc: 'Regular physical activity (0 = Inactive, 1 = Active).' },
  ];

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          <div className="mb-4 pb-2 border-bottom">
            <h2 className="fw-bold mb-1">📖 Project Architecture & Clinical Documentation</h2>
            <p className="text-muted small mb-0">
              Comprehensive explanation of dataset features, full-stack architecture, and machine learning pipeline.
            </p>
          </div>

          {/* Section 1: Overview */}
          <div className="custom-card p-4 mb-4">
            <h4 className="fw-bold mb-3">1. Project Overview</h4>
            <p className="text-muted">
              Cardiovascular diseases (CVDs) are the leading cause of death globally. Early identification of high-risk patients 
              enables lifestyle interventions and preventative clinical care. This project implements a complete, full-stack machine 
              learning application trained on the certified 70,000-patient <code>cardio_train</code> dataset containing 11 diagnostic and lifestyle biomarkers.
            </p>
          </div>

          {/* Section 2: Clinical Biomarkers */}
          <div className="custom-card p-4 mb-4">
            <h4 className="fw-bold mb-3">2. Dataset Features Dictionary</h4>
            <p className="text-muted small">
              The dataset contains 11 clinical and lifestyle inputs used to predict the presence (1) or absence (0) of cardiovascular disease:
            </p>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Feature</th>
                    <th>Type</th>
                    <th>Clinical Description</th>
                  </tr>
                </thead>
                <tbody>
                  {featuresList.map((f, i) => (
                    <tr key={i}>
                      <td><code>{f.name}</code></td>
                      <td><span className="badge bg-secondary">{f.type}</span></td>
                      <td>{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Machine Learning Pipeline */}
          <div className="custom-card p-4 mb-4">
            <h4 className="fw-bold mb-3">3. ML Pipeline & Consistency</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <h6 className="fw-bold text-primary">Data Preprocessing & Scaling</h6>
                  <p className="small text-muted mb-0">
                    The non-predictive <code>id</code> column is removed, duplicate entries are pruned, and physiological outliers are filtered. Features are normalized using Scikit-Learn's 
                    <code>StandardScaler</code>. The fitted scaler is saved to <code>scaler.pkl</code> so the FastAPI backend uses 
                    identical scaling parameters for inference.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <h6 className="fw-bold text-success">Algorithm Selection</h6>
                  <p className="small text-muted mb-0">
                    We benchmarked Logistic Regression, Decision Tree, K-Nearest Neighbors, and Random Forest on over 68,000 clean records. 
                    <strong>Random Forest Classifier</strong> achieved the strongest discrimination performance (73.2% Accuracy, 0.805 ROC-AUC) 
                    and provides calibrated probability estimation via <code>predict_proba</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Limitations */}
          <div className="disclaimer-banner">
            <h6 className="fw-bold mb-1">⚠️ Medical Limitations & Ethical Considerations</h6>
            <div className="small">
              This system does not replace diagnostic procedures performed by licensed cardiologists, such as echocardiograms or angiograms. Machine learning predictions can reflect dataset biases and must never be utilized as the sole foundation for clinical patient prescriptions or medical treatments.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default About;
