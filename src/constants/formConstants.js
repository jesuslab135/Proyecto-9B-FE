/**
 * Form field constants for the cigarette prediction application
 * Using uppercase naming convention for constants
 */

// Form field identifiers
export const FIELD_EDAD = 'edad';
export const FIELD_PESO = 'peso';
export const FIELD_ALTURA = 'altura';
export const FIELD_HABITOS = 'habitos';
export const FIELD_EMOCIONES = 'emociones';
export const FIELD_MOTIVOS = 'motivos';
export const FIELD_SOLUCIONES = 'soluciones';

// Form validation messages
export const MSG_REQUIRED_FIELD = 'Este campo es requerido';
export const MSG_INVALID_NUMBER = 'Por favor ingrese un número válido';
export const MSG_MIN_VALUE = 'El valor es demasiado bajo';
export const MSG_MAX_VALUE = 'El valor es demasiado alto';

// Form page routes
export const ROUTE_HABITS = '/onboarding/habitos';
export const ROUTE_RESULTS = '/onboarding/resultados';

// Validation ranges
export const MIN_EDAD = 10;
export const MAX_EDAD = 120;
export const MIN_PESO = 20;
export const MAX_PESO = 300;
export const MIN_ALTURA = 50;
export const MAX_ALTURA = 250;

// Form field configurations
export const BASIC_INFO_FIELDS = [
  {
    id: FIELD_EDAD,
    label: 'Edad',
    placeholder: 'Ingrese su edad',
    type: 'number',
    unit: 'años',
    min: MIN_EDAD,
    max: MAX_EDAD,
  },
  {
    id: FIELD_PESO,
    label: 'Peso',
    placeholder: 'Ingrese su peso',
    type: 'number',
    unit: 'kg',
    min: MIN_PESO,
    max: MAX_PESO,
  },
  {
    id: FIELD_ALTURA,
    label: 'Altura',
    placeholder: 'Ingrese su altura',
    type: 'number',
    unit: 'cm',
    min: MIN_ALTURA,
    max: MAX_ALTURA,
  },
];

export const HABITS_FIELDS = [
  {
    id: FIELD_HABITOS,
    label: 'Hábitos',
    type: 'checkbox-group',
    options: ['Fumar cigarrillos', 'Beber alcohol', 'Vapear', 'Correr', 'Leer', 'Otro'],
  },
  {
    id: FIELD_EMOCIONES,
    label: 'Emociones',
    type: 'checkbox-group',
    options: ['Ansiedad', 'Estrés', 'Aburrimiento', 'Tristeza', 'Enojo', 'Felicidad', 'Calma', 'Frustración', 'Otro'],
  },
  {
    id: FIELD_MOTIVOS,
    label: 'Motivos',
    type: 'checkbox-group',
    options: ['Social', 'Trabajo', 'Habitual', 'Problemas personales', 'Celebración', 'Otro'],
  },
  {
    id: FIELD_SOLUCIONES,
    label: 'Soluciones',
    type: 'checkbox-group',
    options: ['Respiración', 'Caminar', 'Correr', 'Llamar amigo', 'Beber agua', 'Meditación', 'Música', 'Leer', 'Chicle', 'Otro'],
  },
];
