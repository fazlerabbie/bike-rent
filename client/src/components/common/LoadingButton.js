import React from 'react';
import './LoadingButton.css';

const LoadingButton = ({ 
  loading, 
  disabled, 
  onClick, 
  children, 
  type = "button", 
  className = "", 
  variant = "primary",
  size = "medium"
}) => {
  const buttonClass = `loading-btn ${variant} ${size} ${className} ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`;
  
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading && <span className="spinner"></span>}
      <span className={loading ? 'loading-text' : ''}>{children}</span>
    </button>
  );
};

export default LoadingButton;
