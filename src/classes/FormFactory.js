/**
 * FormFactory class - Factory pattern for creating form instances
 */
import { FormData } from './FormData';
import { BASIC_INFO_FIELDS, HABITS_FIELDS } from '../constants/formConstants';

export class FormFactory {
  /**
   * Create basic info form
   */
  static createBasicInfoForm() {
    const formData = new FormData();
    formData.loadFromStorage('basic-info-form');
    return {
      formData,
      fields: BASIC_INFO_FIELDS,
      storageKey: 'basic-info-form',
    };
  }

  /**
   * Create habits form
   */
  static createHabitsForm() {
    const formData = new FormData();
    formData.loadFromStorage('habits-form');
    return {
      formData,
      fields: HABITS_FIELDS,
      storageKey: 'habits-form',
    };
  }

  /**
   * Get all form data
   */
  static getAllFormData() {
    const basicInfo = new FormData();
    basicInfo.loadFromStorage('basic-info-form');
    
    const habits = new FormData();
    habits.loadFromStorage('habits-form');

    return {
      basicInfo: basicInfo.getData(),
      habits: habits.getData(),
    };
  }
}
