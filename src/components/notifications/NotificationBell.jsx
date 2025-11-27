import { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationToast from './NotificationToast';
import './NotificationBell.css';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeToasts, setActiveToasts] = useState([]);
  const { 
    notifications, 
    unreadCount, 
    newNotifications, 
    markAsRead, 
    markAllAsRead
  } = useNotifications();
  
  // Manejar notificaciones nuevas para mostrar toast
  useEffect(() => {
    if (newNotifications && newNotifications.length > 0) {
      // Agregar nuevas notificaciones a los toasts activos
      newNotifications.forEach(notification => {
        // Verificar que no exista ya
        setActiveToasts(prev => {
          const exists = prev.some(t => t.id === notification.id);
          if (!exists) {
            return [...prev, notification];
          }
          return prev;
        });
      });
    }
  }, [newNotifications]);
  
  const handleRemoveToast = (notificationId) => {
    setActiveToasts(prev => prev.filter(t => t.id !== notificationId));
  };
  
  // Mapeo de tipos a emojis
  const getTypeIcon = (tipo) => {
    const icons = {
      'alerta': '⚠️',
      'recomendacion': '💡',
      'recordatorio': '🔔',
      'logro': '🏆'
    };
    return icons[tipo] || '📬';
  };
  
  const handleNotificationClick = async (notification) => {
    if (!notification.leida) {
      await markAsRead(notification.id);
    }
    
    // Opcional: navegar al deseo relacionado
    if (notification.deseo) {
      window.location.href = `/dashboard`;
    }
  };
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setIsOpen(false);
  };
  
  const formatTime = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES');
  };
  
  return (
    <>
      {/* Toast Notifications */}
      {activeToasts.map((notification, index) => (
        <div 
          key={notification.id} 
          style={{ 
            position: 'fixed',
            top: `${80 + (index * 110)}px`,
            right: '20px',
            zIndex: 9999 - index
          }}
        >
          <NotificationToast
            notification={notification}
            onClose={() => handleRemoveToast(notification.id)}
            duration={5000}
          />
        </div>
      ))}
      
      {/* Bell Icon + Dropdown */}
      <div className="notification-bell-container">
        <button 
          className="notification-bell"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notificaciones"
        >
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
        
        {isOpen && (
          <>
            <div className="notification-overlay" onClick={() => setIsOpen(false)}></div>
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notificaciones</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} className="mark-all-read">
                    Marcar todas como leídas
                  </button>
                )}
              </div>
              
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <p>🎉 No tienes notificaciones</p>
                    <small>Te avisaremos cuando haya algo nuevo</small>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.leida ? 'unread' : ''} priority-${notification.tipo}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        {getTypeIcon(notification.tipo)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-type">{notification.tipo}</div>
                        <p className="notification-message">{notification.contenido}</p>
                        <span className="notification-time">
                          {formatTime(notification.fecha_envio)}
                        </span>
                      </div>
                      {!notification.leida && <div className="unread-dot"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
