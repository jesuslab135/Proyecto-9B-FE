# Authentication System - Implementation Guide

## 📋 Overview

Comprehensive authentication system with JWT tokens, role-based access control, OOP patterns, and frontend logging.

## 🏗️ Architecture

### **Services (Singleton Pattern)**

#### 1. **Logger Service** (`src/services/Logger.js`)
- Centralized logging with multiple levels (INFO, WARN, ERROR, DEBUG)
- Prevents application crashes with graceful error handling
- Development vs. production modes
- Optional backend logging integration

```javascript
import { logger } from './services/Logger';

logger.info('User logged in', { userId: 123 });
logger.error('Login failed', error);
```

#### 2. **StorageService** (`src/services/StorageService.js`)
- Secure token and user data management
- LocalStorage abstraction with error handling
- Token expiration tracking
- Authentication state checking

```javascript
import { storageService } from './services/StorageService';

storageService.setToken(token, expiresIn);
storageService.getUser();
storageService.isAuthenticated();
```

#### 3. **AuthService** (`src/services/AuthService.js`)
- Complete authentication flow (login, register, logout)
- JWT token management and refresh
- Role-based access control (admin/consumer)
- User profile management

```javascript
import { authService } from './services/AuthService';

const result = await authService.login(email, password);
if (result.success) {
  navigate(result.redirectTo); // Auto-redirect based on role
}
```

### **Components**

#### 1. **LoginRegister** (`src/components/Login_Register_components/LoginRegister.jsx`)
- Dual-form component with animated toggle
- Integrated with AuthService
- Form validation and error handling
- Auto-redirect after successful authentication

#### 2. **ProtectedRoute** (`src/components/Auth/ProtectedRoute.jsx`)
- HOC for route protection
- Role-based access control
- Auto-redirect for unauthorized users

```javascript
<ProtectedRoute requiredRole="administrador">
  <AdminDashboard />
</ProtectedRoute>
```

#### 3. **PhysicalDataForm** (`src/components/Onboarding/PhysicalDataForm.jsx`)
- Collects: edad (age), peso (weight), altura (height)
- Part of user onboarding flow
- Optional step (can skip)

#### 4. **FormulariosForm** (`src/components/Onboarding/FormulariosForm.jsx`)
- Comprehensive user questionnaire
- Habit tracking and motivation assessment
- Progress indicator

## 🔐 Authentication Flow

### **Registration Flow**
```
1. User fills registration form
2. POST /auth/register → Backend
3. Auto-login with returned token
4. Redirect to /onboarding/physical-data
5. Complete physical data (optional)
6. Redirect to /onboarding/formularios
7. Complete questionnaire (optional)
8. Redirect to /dashboard (consumer) or /admin/dashboard (admin)
```

### **Login Flow**
```
1. User enters email/password
2. POST /auth/login → Backend
3. Receive { token, user, expires_in }
4. Store token + user data
5. Redirect based on role:
   - administrador → /admin/dashboard
   - consumidor → /dashboard
```

### **Token Management**
```
1. Token stored in localStorage
2. Auto-attached to all API requests (interceptor)
3. Token expiration tracked
4. Auto-refresh when expired
5. Logout on refresh failure
```

## 🛣️ Routes Configuration

```javascript
// Public routes
/ → Home
/login → LoginRegister

// Protected routes (requires authentication)
/onboarding/physical-data → PhysicalDataForm
/onboarding/formularios → FormulariosForm

// Role-specific routes
/dashboard → Consumer Dashboard (requiredRole: "consumidor")
/admin/dashboard → Admin Dashboard (requiredRole: "administrador")
```

## 🔌 Backend API Integration

### **Required Endpoints**

```javascript
// Authentication
POST /auth/login
Body: { email, password }
Response: { token, refresh_token, user, expires_in }

POST /auth/register
Body: { nombre, email, password, telefono, rol }
Response: { token, user, expires_in }

POST /auth/refresh
Body: { refresh_token }
Response: { token, expires_in }

POST /auth/logout
Response: { success }

// User Profile
GET /usuarios/:id
Response: { id, nombre, email, telefono, rol, ... }

PATCH /usuarios/:id/profile
Body: { nombre, telefono, ... }
Response: { updated user data }

// Physical Data
POST /consumidores/:id/datos-fisicos
Body: { edad, peso, altura }
Response: { success }

GET /consumidores/:id/datos-fisicos
Response: { edad, peso, altura }

// Formularios
POST /formularios
Body: { usuario_id, habito_principal, frecuencia_uso, ... }
Response: { success, formulario_id }

GET /formularios/:usuario_id
Response: { formulario data }
```

### **Database Schema (usuarios table)**

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(50), -- 'administrador' or 'consumidor'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Setup Instructions

### **1. Environment Variables**

Create `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Run Development Server**

```bash
npm run dev
```

### **4. Backend Configuration**

Ensure backend is running and supports:
- CORS for frontend origin
- JWT token generation/validation
- All required endpoints listed above

## 🧪 Testing Authentication

### **Test Admin Login**
```javascript
Email: admin@example.com
Password: admin123
Expected: Redirect to /admin/dashboard
```

### **Test Consumer Registration**
```javascript
1. Fill registration form
2. Submit → Auto-login
3. Redirect to /onboarding/physical-data
4. Fill physical data → /onboarding/formularios
5. Fill questionnaire → /dashboard
```

### **Test Role-Based Access**
```javascript
// As consumer, try to access /admin/dashboard
Expected: Redirect to /dashboard

// As admin, try to access /dashboard (consumer)
Expected: Redirect to /admin/dashboard
```

## 🐛 Error Handling

All errors are logged and displayed to users:

```javascript
// Network errors
"Error de conexión. Por favor intente nuevamente."

// Validation errors
"Por favor complete todos los campos"
"Por favor ingrese un email válido"

// Authentication errors
"Credenciales inválidas"
"Sesión expirada"
```

## 📊 Logging Examples

```javascript
// User actions
logger.info('User logged in', { userId: 123, role: 'consumidor' });

// Errors
logger.error('Login failed', error);

// Debug (development only)
logger.debug('Token refreshed', { token: '...' });

// Export logs for debugging
console.log(logger.exportLogs());
```

## 🔧 Customization

### **Change Token Storage Location**
Edit `src/services/StorageService.js`:
```javascript
// Use sessionStorage instead of localStorage
sessionStorage.setItem(key, value);
```

### **Add New Role**
Edit `src/services/AuthService.js`:
```javascript
this.ROLES = {
  ADMIN: 'administrador',
  CONSUMER: 'consumidor',
  MODERATOR: 'moderador', // New role
};
```

### **Customize Redirect Logic**
Edit `AuthService._getRedirectPath()`:
```javascript
_getRedirectPath(role) {
  switch (role) {
    case this.ROLES.ADMIN:
      return '/admin/dashboard';
    case this.ROLES.MODERATOR:
      return '/moderator/panel';
    default:
      return '/dashboard';
  }
}
```

## 📦 File Structure

```
src/
├── services/
│   ├── Logger.js              # Logging service
│   ├── StorageService.js      # Token/data storage
│   └── AuthService.js         # Authentication logic
├── components/
│   ├── Auth/
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── Login_Register_components/
│   │   └── LoginRegister.jsx  # Login/register forms
│   └── Onboarding/
│       ├── PhysicalDataForm.jsx
│       ├── FormulariosForm.jsx
│       └── OnboardingForms.css
├── utils/
│   ├── api/
│   │   ├── endpoints.js       # API endpoint definitions
│   │   ├── https.js           # Axios instance + interceptors
│   │   ├── rest.js            # REST helpers
│   │   └── usuarios.client.js # User API methods
│   └── login-register/
│       └── script.js          # Form toggle logic
└── main.jsx                   # Routes configuration
```

## 🎯 Next Steps

1. **Implement actual dashboards** for consumer and admin
2. **Add profile page** to display/edit user data
3. **Create password reset flow**
4. **Add email verification**
5. **Implement refresh token rotation**
6. **Add remember me functionality**
7. **Create admin user management interface**

## 🔒 Security Best Practices

✅ **Implemented:**
- JWT tokens for stateless authentication
- Token expiration tracking
- Secure token storage
- Request interceptors for automatic token injection
- Role-based access control
- Error logging without exposing sensitive data

🚧 **TODO (Backend):**
- HTTPS in production
- Refresh token rotation
- Rate limiting for login attempts
- Password hashing (bcrypt)
- CSRF protection
- Input sanitization

## 📝 Notes

- All forms include proper validation
- Loading states prevent duplicate submissions
- Error messages are user-friendly (Spanish)
- Onboarding forms are optional (can skip)
- Auto-redirect based on authentication state
- Singleton pattern ensures single service instances
- OOP design for maintainability and testability

---

**Created:** November 4, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready (pending backend integration)
