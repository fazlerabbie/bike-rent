import React from 'react';
import './Message.css';

const Message = ({ 
  type = 'info', 
  message, 
  onClose, 
  autoClose = false, 
  duration = 5000,
  className = ""
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`message ${type} ${className}`}>
      <span className="message-icon">{getIcon()}</span>
      <span className="message-text">{message}</span>
      {onClose && (
        <button className="message-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default Message;
