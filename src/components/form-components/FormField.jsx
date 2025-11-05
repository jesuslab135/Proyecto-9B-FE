import React, { useState } from 'react';
import './FormField.css';

/**
 * FormField component - Reusable form field with validation
 */
export const FormField = ({ field, value, error, onChange }) => {
  const [otroText, setOtroText] = useState('');

  const handleChange = (e) => {
    onChange(field.id, e.target.value);
  };

  const handleCheckboxChange = (option, checked) => {
    const currentValues = Array.isArray(value) ? value : [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter(v => !v.startsWith(option));
      if (option === 'Otro') {
        setOtroText('');
      }
    }

    onChange(field.id, newValues);
  };

  const handleOtroTextChange = (e) => {
    const text = e.target.value;
    setOtroText(text);
    
    const currentValues = Array.isArray(value) ? value : [];
    const filteredValues = currentValues.filter(v => !v.startsWith('Otro'));
    
    if (text.trim()) {
      onChange(field.id, [...filteredValues, `Otro: ${text}`]);
    } else {
      onChange(field.id, filteredValues);
    }
  };

  const isChecked = (option) => {
    if (!Array.isArray(value)) return false;
    return value.some(v => v.startsWith(option));
  };

  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-field-label">
        {field.label}
        {field.unit && <span className="form-field-unit">({field.unit})</span>}
      </label>
      
      {field.type === 'checkbox-group' ? (
        <div className="checkbox-group">
          {field.options.map((option) => (
            <div key={option} className="checkbox-option">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id={`${field.id}-${option}`}
                  checked={isChecked(option)}
                  onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                  className="checkbox-input"
                />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="checkbox-label"
                >
                  {option}
                </label>
              </div>
              {option === 'Otro' && isChecked('Otro') && (
                <input
                  type="text"
                  placeholder="Especifica otro..."
                  value={otroText}
                  onChange={handleOtroTextChange}
                  className="otro-input"
                />
              )}
            </div>
          ))}
        </div>
      ) : field.type === 'textarea' ? (
        <textarea
          id={field.id}
          placeholder={field.placeholder}
          value={value}
          onChange={handleChange}
          rows={field.rows}
          className={`form-field-textarea ${error ? 'error' : ''}`}
        />
      ) : (
        <input
          id={field.id}
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={handleChange}
          min={field.min}
          max={field.max}
          className={`form-field-input ${error ? 'error' : ''}`}
        />
      )}
      
      {error && (
        <p className="form-field-error">
          {error}
        </p>
      )}
    </div>
  );
};
