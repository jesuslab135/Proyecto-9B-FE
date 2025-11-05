/**
 * FormulariosForm Component
 * Collects detailed user questionnaire data
 * This form is filled once during onboarding
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { logger } from '../../services/Logger';
import { http } from '../../utils/api/https';
import './OnboardingForms.css';

const FormulariosForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    habito_principal: '',
    frecuencia_uso: '',
    tiempo_uso: '',
    motivacion_cambio: '',
    nivel_compromiso: '',
    apoyo_social: '',
    intentos_previos: '',
    objetivo_principal: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const requiredFields = [
      'habito_principal',
      'frecuencia_uso',
      'tiempo_uso',
      'motivacion_cambio',
      'nivel_compromiso',
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      logger.info('FormulariosForm: Submitting formularios data');

      await http.post(`/formularios`, {
        usuario_id: currentUser.id,
        ...formData,
      });

      logger.info('FormulariosForm: Formularios data saved successfully');

      // Navigate to dashboard after completing onboarding
      navigate('/dashboard');
    } catch (error) {
      logger.error('FormulariosForm: Error saving formularios data', error);
      setError('Error al guardar los datos. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow users to skip and complete later
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card formularios-card">
        <div className="onboarding-header">
          <h1>Cuestionario de Perfil</h1>
          <p>Ayúdanos a entender mejor tus necesidades</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="habito_principal">
              <i className='bx bx-target-lock'></i>
              Hábito Principal a Cambiar *
            </label>
            <select
              id="habito_principal"
              name="habito_principal"
              value={formData.habito_principal}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="fumar">Fumar</option>
              <option value="alcohol">Consumo de Alcohol</option>
              <option value="drogas">Uso de Drogas</option>
              <option value="juego">Juego Compulsivo</option>
              <option value="tecnologia">Uso Excesivo de Tecnología</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="frecuencia_uso">
              <i className='bx bx-time'></i>
              Frecuencia de Uso *
            </label>
            <select
              id="frecuencia_uso"
              name="frecuencia_uso"
              value={formData.frecuencia_uso}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="diario">Diario</option>
              <option value="varios_por_semana">Varios días por semana</option>
              <option value="semanal">Una vez por semana</option>
              <option value="ocasional">Ocasional</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tiempo_uso">
              <i className='bx bx-calendar'></i>
              ¿Cuánto tiempo llevas con este hábito? *
            </label>
            <select
              id="tiempo_uso"
              name="tiempo_uso"
              value={formData.tiempo_uso}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="menos_6_meses">Menos de 6 meses</option>
              <option value="6_12_meses">6-12 meses</option>
              <option value="1_3_anos">1-3 años</option>
              <option value="3_5_anos">3-5 años</option>
              <option value="mas_5_anos">Más de 5 años</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="motivacion_cambio">
              <i className='bx bx-heart'></i>
              Principal Motivación para Cambiar *
            </label>
            <textarea
              id="motivacion_cambio"
              name="motivacion_cambio"
              value={formData.motivacion_cambio}
              onChange={handleChange}
              placeholder="Describe tu principal motivación..."
              rows="3"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nivel_compromiso">
              <i className='bx bx-check-circle'></i>
              Nivel de Compromiso (1-10) *
            </label>
            <input
              type="range"
              id="nivel_compromiso"
              name="nivel_compromiso"
              value={formData.nivel_compromiso}
              onChange={handleChange}
              min="1"
              max="10"
              disabled={isLoading}
              required
            />
            <div className="range-value">{formData.nivel_compromiso || '5'}/10</div>
          </div>

          <div className="form-group">
            <label htmlFor="apoyo_social">
              <i className='bx bx-group'></i>
              ¿Tienes apoyo social para este cambio?
            </label>
            <select
              id="apoyo_social"
              name="apoyo_social"
              value={formData.apoyo_social}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Seleccione una opción</option>
              <option value="si_mucho">Sí, mucho apoyo</option>
              <option value="si_algo">Sí, algo de apoyo</option>
              <option value="poco">Poco apoyo</option>
              <option value="no">No tengo apoyo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="intentos_previos">
              <i className='bx bx-history'></i>
              ¿Has intentado cambiar este hábito antes?
            </label>
            <select
              id="intentos_previos"
              name="intentos_previos"
              value={formData.intentos_previos}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Seleccione una opción</option>
              <option value="si_varias">Sí, varias veces</option>
              <option value="si_una">Sí, una vez</option>
              <option value="no">No, es mi primer intento</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="objetivo_principal">
              <i className='bx bx-trophy'></i>
              Tu Objetivo Principal
            </label>
            <textarea
              id="objetivo_principal"
              name="objetivo_principal"
              value={formData.objetivo_principal}
              onChange={handleChange}
              placeholder="Describe tu objetivo principal..."
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Omitir
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Completar Registro'}
            </button>
          </div>
        </form>

        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
          <p className="progress-text">Paso 2 de 2</p>
        </div>
      </div>
    </div>
  );
};

export default FormulariosForm;
