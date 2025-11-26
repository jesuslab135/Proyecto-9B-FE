import { useState, useEffect } from 'react';
import { authService } from '../../services/AuthService';
import { UsuariosAPI } from '../../utils/api/usuarios.client';
import { logger } from '../../services/Logger';
import './Configuracion.css';

export default function Configuracion() {
  const user = authService.getCurrentUser();
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
  });
  
  // State for notification preferences (stored in localStorage for now)
  const [notificationPrefs, setNotificationPrefs] = useState({
    enableNotifications: true,
  });
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // UI States
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Load notification preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notificationPrefs');
    if (savedPrefs) {
      setNotificationPrefs(JSON.parse(savedPrefs));
    }
  }, []);
  
  // Save notification preferences to localStorage
  const saveNotificationPrefs = (prefs) => {
    localStorage.setItem('notificationPrefs', JSON.stringify(prefs));
    setNotificationPrefs(prefs);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('notificationPrefsChanged', { 
      detail: prefs 
    }));
    
    logger.info('Notification preferences updated:', prefs);
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await UsuariosAPI.patch(user.id, {
        nombre: profileData.nombre,
        telefono: profileData.telefono,
        // Email usually shouldn't be changed without verification
      });
      
      // Update local user data
      const updatedUser = { ...user, ...profileData };
      authService.currentUser = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: '✓ Perfil actualizado exitosamente' });
      logger.info('Profile updated successfully');
    } catch (error) {
      setMessage({ type: 'error', text: '✗ Error al actualizar perfil' });
      logger.error('Profile update failed', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '✗ Las contraseñas no coinciden' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '✗ La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Note: You'll need to implement a password change endpoint in your backend
      await UsuariosAPI.patch(user.id, {
        password: passwordData.newPassword,
        current_password: passwordData.currentPassword,
      });
      
      setMessage({ type: 'success', text: '✓ Contraseña actualizada exitosamente' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      logger.info('Password changed successfully');
    } catch (error) {
      setMessage({ type: 'error', text: '✗ Error al cambiar contraseña' });
      logger.error('Password change failed', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Handle account deletion
// Handle account deletion (UPDATED TO USE SOFT DELETE)
const handleAccountDelete = async () => {
  setIsLoading(true);
  
  try {
    // Use soft delete instead of hard delete
    const response = await UsuariosAPI.softDelete(user.id);
    
    setMessage({ 
      type: 'success', 
      text: '✓ Cuenta desactivada. Tienes 30 días para restaurarla si cambias de opinión.' 
    });
    
    logger.info('Account soft deleted', response);
    
    // Logout and redirect after showing message
    setTimeout(() => {
      authService.logout();
      window.location.href = '/login';
    }, 3000);
    
  } catch (error) {
    setMessage({ 
      type: 'error', 
      text: '✗ Error al eliminar cuenta: ' + (error.message || 'Error desconocido')
    });
    logger.error('Account deletion failed', error);
  } finally {
    setIsLoading(false);
    setShowDeleteModal(false);
  }
};
  
  return (
    <div className="configuracion-container">
      {/* Header */}
      <div className="config-header">
        <h1>⚙️ Configuración</h1>
        <p className="config-subtitle">Personaliza tu experiencia</p>
      </div>
      
      {/* Message Alert */}
      {message.text && (
        <div className={`config-message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {/* Navigation Tabs */}
      <div className="config-nav">
        <button
          className={`nav-tab ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          👤 Perfil
        </button>
        <button
          className={`nav-tab ${activeSection === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveSection('notifications')}
        >
          🔔 Notificaciones
        </button>
        <button
          className={`nav-tab ${activeSection === 'account' ? 'active' : ''}`}
          onClick={() => setActiveSection('account')}
        >
          🔑 Cuenta
        </button>
        <button
          className={`nav-tab ${activeSection === 'help' ? 'active' : ''}`}
          onClick={() => setActiveSection('help')}
        >
          ❓ Ayuda
        </button>
      </div>
      
      {/* Content Sections */}
      <div className="config-content">
        
        {/* PROFILE SECTION */}
        {activeSection === 'profile' && (
          <section className="config-section">
            <h2>Información Personal</h2>
            <form onSubmit={handleProfileUpdate} className="config-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  value={profileData.nombre}
                  onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  disabled
                  title="El email no puede ser modificado"
                />
                <small className="form-help">El email no puede ser modificado</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  id="telefono"
                  value={profileData.telefono}
                  onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                  disabled={isLoading}
                  placeholder="+52 123 456 7890"
                />
              </div>
              
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </section>
        )}
        
        {/* NOTIFICATIONS SECTION */}
{activeSection === 'notifications' && (
  <section className="config-section">
    <h2>Preferencias de Notificaciones</h2>
    
    <div className="settings-group">
      <div className="setting-item">
        <div className="setting-info">
          <h3>Activar Notificaciones</h3>
          <p>Recibir alertas y recordatorios de la app</p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={notificationPrefs.enableNotifications}
            onChange={(e) => saveNotificationPrefs({
              ...notificationPrefs,
              enableNotifications: e.target.checked
            })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  </section>
)}
        
        {/* ACCOUNT SECTION */}
        {activeSection === 'account' && (
          <section className="config-section">
            <h2>Gestión de Cuenta</h2>
            
            {/* Change Password */}
            <div className="account-subsection">
              <h3>Cambiar Contraseña</h3>
              <form onSubmit={handlePasswordChange} className="config-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    disabled={isLoading}
                    minLength={6}
                    required
                  />
                  <small className="form-help">Mínimo 6 caracteres</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                </button>
              </form>
            </div>
            
            {/* Delete Account */}
            <div className="account-subsection danger-zone">
              <h3>🚨 Zona de Peligro</h3>
              <p>Una vez eliminada, tu cuenta no puede ser recuperada.</p>
              <button 
                className="btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Eliminar Cuenta
              </button>
            </div>
          </section>
        )}
        
        {/* HELP SECTION */}
        {activeSection === 'help' && (
          <section className="config-section">
            <h2>Ayuda y Soporte</h2>
            
            {/* FAQ */}
            <div className="faq-section">
              <h3>Preguntas Frecuentes</h3>
              
              <details className="faq-item">
                <summary>¿Por qué no veo datos de sensores en tiempo real?</summary>
                <p>
                  Asegúrate de que tu dispositivo ESP32 esté conectado a WiFi y que esté enviando datos 
                  correctamente. Los datos se actualizan cada 5 segundos. Verifica también que hayas 
                  iniciado sesión correctamente.
                </p>
              </details>
              
              <details className="faq-item">
                <summary>¿Qué significa "urge_label" en las predicciones?</summary>
                <p>
                  Es la predicción del modelo de IA. Un valor de 1 indica alta probabilidad de craving 
                  (antojo), mientras que 0 indica baja probabilidad. Úsalo como una alerta temprana para 
                  prepararte mentalmente.
                </p>
              </details>
              
              <details className="faq-item">
                <summary>¿Los datos de mi corazón son precisos?</summary>
                <p>
                  La frecuencia cardíaca es una aproximación basada en sensores de consumo. Para datos 
                  médicos precisos o decisiones de salud importantes, siempre consulta con un profesional 
                  de la salud certificado.
                </p>
              </details>
            </div>
            
            {/* Contact Support */}
            <div className="support-section">
              <h3>¿Necesitas más ayuda?</h3>
              <p>Nuestro equipo está aquí para ayudarte</p>
              <a 
                href="mailto:support@addictless.com" 
                className="btn-secondary"
              >
                📧 Contactar Soporte
              </a>
            </div>
          </section>
        )}
      </div>
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>⚠️ ¿Eliminar Cuenta?</h2>
            <p>Esta acción es permanente e irreversible.</p>
            <p>Se eliminarán:</p>
            <ul>
              <li>Tu perfil y datos personales</li>
              <li>Todos tus registros de deseos</li>
              <li>Historial de datos de sensores</li>
              <li>Tus logros y rachas</li>
            </ul>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-danger"
                onClick={handleAccountDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar Definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}