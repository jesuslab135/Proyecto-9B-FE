import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormFactory } from '../../classes/FormFactory';
import { ProgressSteps } from '../../components/form-components/ProgressSteps';
import './ResultsForm.css';

/**
 * Results page - Display analysis results
 */
const Results = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState(null);

  useEffect(() => {
    // Load all form data
    const data = FormFactory.getAllFormData();
    setAllData(data);
  }, []);

  const handleNext = () => {
    // Clear form data from localStorage after completion
    localStorage.removeItem('basic-info-form');
    localStorage.removeItem('habits-form');
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  if (!allData) {
    return (
      <div className="results-loading">
        <p>Cargando resultados...</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-card">
        <ProgressSteps currentStep={3} totalSteps={3} />

        <div className="results-header">
          <h1>¡Análisis Completado!</h1>
          <p>Aquí está un resumen de tu información</p>
        </div>

        <div className="results-grid">
          <div className="result-section">
            <h2>Información Básica</h2>
            <div className="result-content">
              {allData.basicInfo.edad && (
                <div className="result-item">
                  <span className="result-label">Edad:</span>
                  <span className="result-value">{allData.basicInfo.edad} años</span>
                </div>
              )}
              {allData.basicInfo.peso && (
                <div className="result-item">
                  <span className="result-label">Peso:</span>
                  <span className="result-value">{allData.basicInfo.peso} kg</span>
                </div>
              )}
              {allData.basicInfo.altura && (
                <div className="result-item">
                  <span className="result-label">Altura:</span>
                  <span className="result-value">{allData.basicInfo.altura} cm</span>
                </div>
              )}
            </div>
          </div>

          <div className="result-section">
            <h2>Resumen</h2>
            <div className="result-content">
              <div className="result-item">
                <p className="result-status">✓ Información completa registrada</p>
              </div>
              <div className="result-item">
                <p className="result-next-steps">
                  Los datos están listos para análisis predictivo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="result-section full-width">
          <h2>Hábitos y Emociones</h2>
          <div className="result-content">
            {allData.habits.habitos && allData.habits.habitos.length > 0 && (
              <div className="result-detail">
                <p className="result-label">Hábitos:</p>
                <p className="result-value">
                  {Array.isArray(allData.habits.habitos) 
                    ? allData.habits.habitos.join(', ') 
                    : allData.habits.habitos}
                </p>
              </div>
            )}
            {allData.habits.emociones && allData.habits.emociones.length > 0 && (
              <div className="result-detail">
                <p className="result-label">Emociones:</p>
                <p className="result-value">
                  {Array.isArray(allData.habits.emociones) 
                    ? allData.habits.emociones.join(', ') 
                    : allData.habits.emociones}
                </p>
              </div>
            )}
            {allData.habits.motivos && allData.habits.motivos.length > 0 && (
              <div className="result-detail">
                <p className="result-label">Motivos:</p>
                <p className="result-value">
                  {Array.isArray(allData.habits.motivos) 
                    ? allData.habits.motivos.join(', ') 
                    : allData.habits.motivos}
                </p>
              </div>
            )}
            {allData.habits.soluciones && allData.habits.soluciones.length > 0 && (
              <div className="result-detail">
                <p className="result-label">Soluciones:</p>
                <p className="result-value">
                  {Array.isArray(allData.habits.soluciones) 
                    ? allData.habits.soluciones.join(', ') 
                    : allData.habits.soluciones}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="results-actions">
          <button
            onClick={handleNext}
            className="btn-next"
          >
            Siguiente →
          </button>
        </div>

        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
          <p className="progress-text">Paso 3 de 3 - Completado</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
