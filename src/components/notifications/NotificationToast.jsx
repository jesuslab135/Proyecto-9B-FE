import { useEffect, useState } from 'react';
import './NotificationToast.css';

export default function NotificationToast({ notification, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Función handleClose dentro del useEffect para evitar warning de dependencias
    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    };

    // Aparecer con animación
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-cerrar después de duration
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  // Nueva función handleClose para el botón de cierre manual
  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const getIcon = (tipo) => {
    const icons = {
      'alerta': '⚠️',
      'recomendacion': '💡',
      'recordatorio': '🔔',
      'logro': '🏆'
    };
    return icons[tipo] || '📬';
  };

  const getTypeClass = (tipo) => {
    return `toast-${tipo}`;
  };

  if (!notification) return null;

  return (
    <div className={`toast-notification ${isVisible ? 'toast-visible' : ''} ${isExiting ? 'toast-exiting' : ''} ${getTypeClass(notification.tipo)}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon(notification.tipo)}
        </div>
        <div className="toast-body">
          <div className="toast-type">{notification.tipo}</div>
          <div className="toast-message">{notification.contenido}</div>
          <div className="toast-time">Ahora</div>
        </div>
        <button className="toast-close" onClick={handleManualClose} aria-label="Cerrar">
          ✕
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
