# 🚀 Authentication System - Quick Start

## ✅ What Was Implemented

### **1. Core Services (OOP + Singleton Pattern)**

- ✅ **Logger Service** - Frontend logging with crash prevention
- ✅ **StorageService** - Secure token and user data management
- ✅ **AuthService** - Complete authentication flow with JWT

### **2. Components**

- ✅ **LoginRegister** - Animated dual-form with validation
- ✅ **ProtectedRoute** - Role-based route protection
- ✅ **PhysicalDataForm** - Collects edad, peso, altura
- ✅ **FormulariosForm** - Comprehensive user questionnaire

### **3. Features**

- ✅ Login/Register with JWT tokens
- ✅ Role-based access (admin/consumer)
- ✅ Auto-redirect based on user role
- ✅ Token refresh mechanism
- ✅ Form validation and error handling
- ✅ Loading states
- ✅ Frontend logging
- ✅ Onboarding flow (3 forms)

## 🎯 User Flows

### **New User Registration**
```
Register → Auto-login → Physical Data → Formularios → Dashboard
```

### **Existing User Login**
```
Login → Dashboard (consumer) or Admin Dashboard (admin)
```

## 🔌 Backend Requirements

Your backend needs these endpoints:

```javascript
POST /auth/login         // { email, password }
POST /auth/register      // { nombre, email, password, telefono, rol }
POST /auth/refresh       // { refresh_token }
GET  /usuarios/:id       // Get user profile
PATCH /usuarios/:id/profile  // Update profile
POST /consumidores/:id/datos-fisicos  // { edad, peso, altura }
POST /formularios        // Questionnaire data
```

## 🏃 How to Test

### **1. Start the project:**
```bash
npm run dev
```

### **2. Test Registration:**
1. Go to http://localhost:5173/login
2. Click "Register" button (bottom left panel)
3. Fill: nombre, email, telefono, password
4. Submit → Should auto-login and redirect to `/onboarding/physical-data`

### **3. Test Login:**
1. Go to http://localhost:5173/login
2. Fill email and password
3. Submit → Should redirect based on role:
   - `administrador` → `/admin/dashboard`
   - `consumidor` → `/dashboard`

### **4. Test Protected Routes:**
```
Try accessing /dashboard without login → Redirects to /login
Login as admin → Try /dashboard → Redirects to /admin/dashboard
```

## 🔧 Configuration

### **Set API Base URL**

Create `.env` file:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Or edit `src/utils/api/https.js` directly.

## 📂 New Files Created

```
src/
├── services/
│   ├── Logger.js              ✅ NEW
│   ├── StorageService.js      ✅ NEW
│   └── AuthService.js         ✅ NEW
├── components/
│   ├── Auth/
│   │   └── ProtectedRoute.jsx ✅ NEW
│   └── Onboarding/
│       ├── PhysicalDataForm.jsx    ✅ NEW
│       ├── FormulariosForm.jsx     ✅ NEW
│       └── OnboardingForms.css     ✅ NEW
└── AUTHENTICATION_GUIDE.md    ✅ NEW (Full documentation)
```

## 📝 Modified Files

```
src/
├── components/Login_Register_components/
│   └── LoginRegister.jsx      ✅ UPDATED (Added auth integration)
├── utils/api/
│   ├── usuarios.client.js     ✅ UPDATED (Added auth endpoints)
│   └── https.js               ✅ UPDATED (Fixed env vars)
├── utils/login-register/
│   └── script.js              ✅ UPDATED (Fixed toggle logic)
└── main.jsx                   ✅ UPDATED (Added new routes)
```

## 🐛 Common Issues & Solutions

### **"Cannot read properties of null (reading 'addEventListener')"**
✅ FIXED - Script now runs after component mounts

### **Login form doesn't toggle to register**
✅ FIXED - Toggle buttons now work correctly

### **Styles from TitleHome affecting login page**
✅ FIXED - Forms use unique class names

### **Token not being sent to backend**
✅ FIXED - Axios interceptor auto-attaches token to all requests

## 🎨 Styling

All forms are fully styled with:
- Responsive design
- Animations
- Loading states
- Error/success messages
- Progress indicators

## 📊 What Happens After Login

### **Consumer (consumidor):**
```
1. Login successful
2. Token stored in localStorage
3. User data stored
4. Redirect to /dashboard
```

### **Admin (administrador):**
```
1. Login successful
2. Token stored in localStorage
3. User data stored
4. Redirect to /admin/dashboard
```

## 🔐 Security Features

- ✅ JWT tokens
- ✅ Token expiration tracking
- ✅ Auto-refresh on expiry
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Request interceptors
- ✅ Error handling without exposing sensitive data

## 📖 Next Steps

1. **Implement actual dashboard pages** (consumer and admin)
2. **Add profile page** to display/edit user info
3. **Create password reset flow**
4. **Backend integration** - Ensure all endpoints exist
5. **Testing** - Test all flows end-to-end

## 💡 Usage Examples

### **Check if user is logged in:**
```javascript
import { authService } from './services/AuthService';

if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log(user.nombre, user.rol);
}
```

### **Logout:**
```javascript
authService.logout();
// Auto-clears tokens and redirects to /login
```

### **Get user role:**
```javascript
if (authService.isAdmin()) {
  // Show admin features
}

if (authService.isConsumer()) {
  // Show consumer features
}
```

### **Log errors:**
```javascript
import { logger } from './services/Logger';

try {
  // Some operation
} catch (error) {
  logger.error('Operation failed', error);
}
```

## 🎉 Success!

Your authentication system is now complete and ready for backend integration!

For detailed documentation, see `AUTHENTICATION_GUIDE.md`

---

**Status:** ✅ Ready for Testing  
**Last Updated:** November 4, 2025
