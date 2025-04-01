import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = '#007bff'
}) => {
  return (
    <div className={`loading-spinner ${size}`} style={{ borderTopColor: color }}>
      <div className="spinner-inner" />
    </div>
  );
};

export default LoadingSpinner; 