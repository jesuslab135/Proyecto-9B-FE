import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { logger } from '../../services/Logger';
import { ConsumidoresAPI } from '../../utils/api/consumidores.client';
import './OnboardingForms.css';

const PhysicalDataForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    edad: '',
    peso: '',
    altura: '',
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
    if (!formData.edad || !formData.peso || !formData.altura) {
      setError('Por favor complete todos los campos');
      return;
    }

    const edad = parseInt(formData.edad, 10);
    const peso = parseFloat(formData.peso);
    const altura = parseFloat(formData.altura);

    if (edad < 1 || edad > 120) {
      setError('Por favor ingrese una edad válida (1-120 años)');
      return;
    }

    if (peso < 20 || peso > 300) {
      setError('Por favor ingrese un peso válido (20-300 kg)');
      return;
    }

    if (altura < 50 || altura > 250) {
      setError('Por favor ingrese una altura válida (50-250 cm)');
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      logger.info('PhysicalDataForm: Submitting physical data');

      // ✅ PASO 1: Verificar si ya existe un consumidor para este usuario
      let consumidor = null;
      let consumidorExists = false;

      // Verificar si el usuario ya tiene un consumidor_id
      if (currentUser.consumidor_id) {
        try {
          logger.info('PhysicalDataForm: Checking existing consumidor', { consumidor_id: currentUser.consumidor_id });
          consumidor = await ConsumidoresAPI.get(currentUser.consumidor_id);
          consumidorExists = true;
          logger.info('PhysicalDataForm: Consumidor already exists, will UPDATE');
        } catch {
          logger.warn('PhysicalDataForm: Consumidor not found with ID, will try to list');
        }
      }

      // Si no se encontró, buscar por usuario_id en la lista
      if (!consumidorExists) {
        try {
          const consumidoresList = await ConsumidoresAPI.list({ usuario_id: currentUser.id });
          if (consumidoresList && consumidoresList.length > 0) {
            consumidor = consumidoresList[0];
            consumidorExists = true;
            logger.info('PhysicalDataForm: Consumidor found in list, will UPDATE');
          }
        } catch {
          logger.info('PhysicalDataForm: No existing consumidor found, will CREATE');
        }
      }

      const dataToSend = {
        usuario_id: currentUser.id,
        edad,
        peso,
        altura,
      };

      let response;

      // ✅ PASO 2: CREATE o UPDATE según corresponda
      if (consumidorExists && consumidor?.id) {
        logger.info('PhysicalDataForm: Updating consumidor', { consumidor_id: consumidor.id });
        response = await ConsumidoresAPI.patch(consumidor.id, dataToSend);
      } else {
        logger.info('PhysicalDataForm: Creating new consumidor');
        response = await ConsumidoresAPI.create(dataToSend);
      }

      logger.info('PhysicalDataForm: Physical data saved successfully');

      // 🔥 CRÍTICO: Guardar el consumidor_id para usarlo en el siguiente formulario
      if (response && response.id) {
        localStorage.setItem('consumidor_id', response.id);
        logger.info('PhysicalDataForm: Consumidor ID saved', { consumidor_id: response.id });
      }

      navigate('/onboarding/habitos');
    } catch (error) {
      logger.error('PhysicalDataForm: Error saving physical data', error);
      
      let errorMessage = 'Error al guardar los datos. Por favor intente nuevamente.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1>Datos Físicos</h1>
          <p>Ayúdanos a personalizar tu experiencia</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="edad">
              <i className='bx bx-calendar'></i>
              Edad (años)
            </label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              placeholder="Ej: 25"
              min="1"
              max="120"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="peso">
              <i className='bx bx-dumbbell'></i>
              Peso (kg)
            </label>
            <input
              type="number"
              id="peso"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              placeholder="Ej: 70.5"
              step="0.1"
              min="20"
              max="300"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="altura">
              <i className='bx bx-ruler'></i>
              Altura (cm)
            </label>
            <input
              type="number"
              id="altura"
              name="altura"
              value={formData.altura}
              onChange={handleChange}
              placeholder="Ej: 175"
              min="50"
              max="250"
              disabled={isLoading}
              required
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
              {isLoading ? 'Guardando...' : 'Continuar'}
            </button>
          </div>
        </form>

        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '33%' }}></div>
          </div>
          <p className="progress-text">Paso 1 de 3</p>
        </div>
      </div>
    </div>
  );
};

export default PhysicalDataForm;
