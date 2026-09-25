import React, { useState, useEffect } from 'react';
import { getModelMetrics } from '../services/api';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModelMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
      setError('Unable to load performance metrics from FastAPI backend. Please check that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="container my-5">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">📊 Model Performance & Evaluation Dashboard</h2>
          <p className="text-muted small mb-0">
            Real performance metrics computed directly on {metrics ? metrics.test_samples.toLocaleString() : '13,724'} hold-out test samples from the dataset.
          </p>
        </div>
        <button 
          className="btn btn-sm btn-outline-primary fw-semibold mt-2 mt-md-0"
          onClick={fetchMetrics}
          disabled={loading}
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading model evaluation metrics from FastAPI...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <div className="fw-bold">Connection Issue:</div>
          <div>{error}</div>
        </div>
      )}

      {metrics && !loading && (
        <div>
          {/* Key Metric Score Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <div className="metric-value text-primary">{metrics.accuracy}%</div>
                <div className="metric-label">Test Accuracy</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <div className="metric-value text-success">{metrics.precision}%</div>
                <div className="metric-label">Precision</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <div className="metric-value text-info">{metrics.recall}%</div>
                <div className="metric-label">Recall (Sensitivity)</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <div className="metric-value text-warning">{metrics.f1_score}%</div>
                <div className="metric-label">F1-Score</div>
              </div>
            </div>
          </div>

          {/* Model Comparison Table & Confusion Matrix */}
          <div className="row g-4 mb-4">
            
            {/* Algorithm Comparison */}
            <div className="col-lg-7">
              <div className="custom-card p-4 h-100">
                <h5 className="fw-bold mb-3">Model Comparison on Test Set ({metrics.test_samples.toLocaleString()} Samples)</h5>
                <p className="text-muted small">
                  Four candidate algorithms were trained on {metrics.train_samples.toLocaleString()} samples and evaluated on the same {metrics.test_samples.toLocaleString()} hold-out test samples.
                </p>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Algorithm</th>
                        <th>Accuracy</th>
                        <th>Precision</th>
                        <th>Recall</th>
                        <th>F1 Score</th>
                        <th>ROC-AUC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.model_comparison && metrics.model_comparison.map((item, idx) => {
                        const isSelected = item.model_name === metrics.selected_model;
                        return (
                          <tr key={idx} className={isSelected ? 'table-primary fw-bold' : ''}>
                            <td>
                              {item.model_name}
                              {isSelected && <span className="badge bg-primary ms-2">Deployed</span>}
                            </td>
                            <td>{item.accuracy}%</td>
                            <td>{item.precision}%</td>
                            <td>{item.recall}%</td>
                            <td>{item.f1_score}%</td>
                            <td>{item.roc_auc}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Confusion Matrix Card */}
            <div className="col-lg-5">
              <div className="custom-card p-4 h-100">
                <h5 className="fw-bold mb-2">Confusion Matrix ({metrics.selected_model})</h5>
                <p className="text-muted small mb-4">
                  Breakdown of {metrics.test_samples.toLocaleString()} test predictions versus ground truth clinical diagnosis.
                </p>

                <div className="d-flex flex-column gap-2 text-center">
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-success-subtle border border-success">
                        <div className="fs-3 fw-bold text-success">
                          {metrics.confusion_matrix.true_negatives}
                        </div>
                        <div className="small fw-semibold text-success-emphasis">
                          True Negatives (TN)
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Healthy correctly classified
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-danger-subtle border border-danger">
                        <div className="fs-3 fw-bold text-danger">
                          {metrics.confusion_matrix.false_positives}
                        </div>
                        <div className="small fw-semibold text-danger-emphasis">
                          False Positives (FP)
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Healthy misclassified as disease
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-warning-subtle border border-warning">
                        <div className="fs-3 fw-bold text-warning-emphasis">
                          {metrics.confusion_matrix.false_negatives}
                        </div>
                        <div className="small fw-semibold text-warning-emphasis">
                          False Negatives (FN)
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Disease missed
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-success-subtle border border-success">
                        <div className="fs-3 fw-bold text-success">
                          {metrics.confusion_matrix.true_positives}
                        </div>
                        <div className="small fw-semibold text-success-emphasis">
                          True Positives (TP)
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Disease correctly detected
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center small text-muted">
                  ROC-AUC Score: <strong className="text-dark">{metrics.roc_auc}</strong> (Near Perfect Discrimination)
                </div>
              </div>
            </div>

          </div>

          {/* Feature Importances Card */}
          {metrics.feature_importances && (
            <div className="custom-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Feature Importance Weights (Random Forest)</h5>
              <p className="text-muted small">
                Shows which clinical features contribute most strongly to the model's cardiovascular risk decisions.
              </p>
              <div className="row g-3">
                {metrics.feature_importances.map((item, index) => (
                  <div key={index} className="col-md-6 col-lg-4">
                    <div className="p-3 border rounded-3 bg-light">
                      <div className="d-flex justify-content-between mb-1 small fw-bold">
                        <span>{item.feature}</span>
                        <span>{item.importance}%</span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className="progress-bar bg-primary" 
                          role="progressbar" 
                          style={{ width: `${Math.max(item.importance * 2, 4)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Dashboard;
