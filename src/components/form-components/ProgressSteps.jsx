import React from 'react';
import './ProgressSteps.css';

/**
 * ProgressSteps component - Visual progress indicator
 */
export const ProgressSteps = ({ currentStep, totalSteps }) => {
  return (
    <div className="progress-steps-container">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <div
              className={`
                progress-step
                ${isActive ? 'active' : ''}
                ${isCompleted ? 'completed' : ''}
                ${!isActive && !isCompleted ? 'inactive' : ''}
              `}
            >
              {stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`
                  progress-line
                  ${isCompleted ? 'completed' : ''}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
