import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../../components/form-components/FormField';
import { ProgressSteps } from '../../components/form-components/ProgressSteps';
import { FormFactory } from '../../classes/FormFactory';
import { Validator } from '../../classes/Validator';
import { authService } from '../../services/AuthService';
import { logger } from '../../services/Logger';
import { FormulariosAPI } from '../../utils/api/formularios.client';
import './HabitsForm.css';

/**
 * Habits page - Form page for habits and emotions
 */
const Habits = () => {
  const navigate = useNavigate();
  const [formInstance] = useState(() => FormFactory.createHabitsForm());
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Load initial values
    const initialValues = {};
    formInstance.fields.forEach(field => {
      const storedValue = formInstance.formData.getField(field.id);
      initialValues[field.id] = storedValue || (field.type === 'checkbox-group' ? [] : '');
    });
    setFormValues(initialValues);
  }, [formInstance.fields, formInstance.formData]);

  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    formInstance.formData.setField(fieldId, value);
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    const { isValid, errors: validationErrors } = Validator.validateFields(
      formInstance.formData,
      formInstance.fields
    );

    if (!isValid) {
      setErrors(validationErrors);
      setSubmitError('Por favor completa todos los campos requeridos');
      return;
    }

    // Save to storage
    formInstance.formData.saveToStorage(formInstance.storageKey);
    
    // Get all form data
    const allData = FormFactory.getAllFormData();
    
    setIsLoading(true);

    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      // 🔥 CRÍTICO: Obtener consumidor_id del localStorage (guardado en PhysicalDataForm)
      const consumidorId = localStorage.getItem('consumidor_id');
      
      if (!consumidorId) {
        throw new Error('No se encontró el ID del consumidor. Por favor completa el paso anterior.');
      }

      logger.info('Habits: Submitting habits data', { consumidor_id: consumidorId });

      // Preparar los datos para enviar al backend - TODOS como arrays
      const habitosArray = Array.isArray(allData.habits.habitos) ? allData.habits.habitos : [];
      const emocionesArray = Array.isArray(allData.habits.emociones) ? allData.habits.emociones : [];
      const motivosArray = Array.isArray(allData.habits.motivos) ? allData.habits.motivos : [];
      const solucionesArray = Array.isArray(allData.habits.soluciones) ? allData.habits.soluciones : [];

      const dataToSend = {
        consumidor: parseInt(consumidorId, 10),  // ✅ Backend espera 'consumidor', no 'consumidor_id'
        habitos: habitosArray,        // ✅ Array JSONB
        emociones: emocionesArray,     // ✅ Array JSONB
        motivos: motivosArray,         // ✅ Array JSONB
        soluciones: solucionesArray,   // ✅ Array JSONB
      };

      // ✅ PASO 1: Verificar si ya existe un formulario para este consumidor
      let formularioExists = false;
      let existingFormularioId = null;

      try {
        const formulariosList = await FormulariosAPI.list({ consumidor: parseInt(consumidorId, 10) });
        if (formulariosList && formulariosList.length > 0) {
          formularioExists = true;
          existingFormularioId = formulariosList[0].id;
          logger.info('Habits: Formulario already exists, will UPDATE', { formulario_id: existingFormularioId });
        }
      } catch {
        logger.info('Habits: No existing formulario found, will CREATE');
      }

      // ✅ PASO 2: CREATE o UPDATE según corresponda
      if (formularioExists && existingFormularioId) {
        logger.info('Habits: Updating formulario', { formulario_id: existingFormularioId });
        await FormulariosAPI.patch(existingFormularioId, dataToSend);
      } else {
        logger.info('Habits: Creating new formulario');
        await FormulariosAPI.create(dataToSend);
      }

      logger.info('Habits: Habits data saved successfully');

      // Navigate to results page
      navigate('/onboarding/resultados');
    } catch (error) {
      logger.error('Habits: Error saving habits data', error);
      
      let errorMessage = 'Error al guardar los datos. Por favor intente nuevamente.';
      
      if (error.message.includes('No se encontró el ID del consumidor')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/physical-data');
  };

  return (
    <div className="habits-container">
      <div className="habits-card">
        <ProgressSteps currentStep={2} totalSteps={3} />

        <div className="habits-header">
          <h1>Hábitos y Emociones</h1>
          <p>Cuéntanos sobre tus hábitos, emociones y motivaciones</p>
        </div>

        {submitError && (
          <div className="error-message">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="habits-form">
          {formInstance.fields.map(field => (
            <FormField
              key={field.id}
              field={field}
              value={formValues[field.id] || ''}
              error={errors[field.id]}
              onChange={handleFieldChange}
            />
          ))}

          <div className="form-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              disabled={isLoading}
            >
              ← Anterior
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Finalizar ✓'}
            </button>
          </div>
        </form>

        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '66%' }}></div>
          </div>
          <p className="progress-text">Paso 2 de 3</p>
        </div>
      </div>
    </div>
  );
};

export default Habits;
