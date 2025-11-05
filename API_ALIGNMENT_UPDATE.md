# API Endpoints - Backend Alignment Update

## 🔧 Changes Made (November 4, 2025)

Based on the actual backend API endpoints from the Health Tracker API, the following corrections were made:

---

## ✅ Updated Files

### 1. `src/utils/api/usuarios.client.js`

**Changed:**
- ❌ `/auth/login` → ✅ `/usuarios/login`
- ❌ `/auth/register` → ✅ `/usuarios/register`
- ❌ Removed `/auth/refresh` (not available in backend)
- ❌ Removed `/auth/logout` (not available in backend)
- ❌ Removed `/usuarios/{id}/profile` endpoints (use standard CRUD)
- ❌ Removed `/usuarios/{id}/physical-data` endpoints (not available)

**Current Working Endpoints:**
```javascript
// Standard CRUD (via rest.js)
GET    /api/usuarios/              // List users
GET    /api/usuarios/{id}/         // Get user by ID
POST   /api/usuarios/              // Create user
PUT    /api/usuarios/{id}/         // Full update
PATCH  /api/usuarios/{id}/         // Partial update
DELETE /api/usuarios/{id}/         // Delete user

// Authentication (direct http calls)
POST   /api/usuarios/login         // Login
POST   /api/usuarios/register      // Register

// Profile
PATCH  /api/usuarios/{id}/profile  // Update profile
```

---

### 2. `src/services/AuthService.js`

**Changed:**
- ✅ Updated login endpoint: `/auth/login` → `/usuarios/login`
- ✅ Updated register endpoint: `/auth/register` → `/usuarios/register`
- ✅ Updated refreshToken method to just logout (endpoint doesn't exist)

---

### 3. `src/components/Onboarding/PhysicalDataForm.jsx`

**Changed:**
- ✅ Updated to use: `POST /consumidores/` with `usuario_id`, `edad`, `peso`, `altura`
- ❌ Removed: `/consumidores/{id}/datos-fisicos` (endpoint doesn't exist)

---

## 📊 Backend API Available (from images)

### **Usuarios** ✅
```
GET    /api/usuarios/
POST   /api/usuarios/
GET    /api/usuarios/{id}/
PUT    /api/usuarios/{id}/
PATCH  /api/usuarios/{id}/
DELETE /api/usuarios/{id}/
PATCH  /api/usuarios/{id}/profile/
POST   /api/usuarios/login/
POST   /api/usuarios/register/
```

### **Consumidores** ✅
```
GET    /api/consumidores/
POST   /api/consumidores/
GET    /api/consumidores/{id}/
PUT    /api/consumidores/{id}/
PATCH  /api/consumidores/{id}/
DELETE /api/consumidores/{id}/
```

### **Administradores** ✅
```
GET    /api/administradores/
POST   /api/administradores/
GET    /api/administradores/{id}/
PUT    /api/administradores/{id}/
PATCH  /api/administradores/{id}/
DELETE /api/administradores/{id}/
```

### **Formularios** ✅
```
GET    /api/formularios/
POST   /api/formularios/
GET    /api/formularios/{id}/
PUT    /api/formularios/{id}/
PATCH  /api/formularios/{id}/
DELETE /api/formularios/{id}/
```

### **Dashboard** (Read-only as requested) ✅
```
GET    /api/dashboard/daily-summary/
GET    /api/dashboard/daily-summary/{consumidor_id}/
GET    /api/dashboard/desires/
GET    /api/dashboard/desires-stats/
GET    /api/dashboard/desires-stats/{deseo_tipo}/
GET    /api/dashboard/desires/{deseo_id}/
GET    /api/dashboard/habit-stats/
GET    /api/dashboard/habit-stats/{consumidor_id}/
GET    /api/dashboard/habit-tracking/
GET    /api/dashboard/habit-tracking/{consumidor_id}/
GET    /api/dashboard/heart-rate/
GET    /api/dashboard/heart-rate-stats/
GET    /api/dashboard/heart-rate-stats/{consumidor_id}/
GET    /api/dashboard/heart-rate/{id}/
GET    /api/dashboard/prediction-summary/
GET    /api/dashboard/prediction-summary/{consumidor_id}/
GET    /api/dashboard/predictions/
GET    /api/dashboard/predictions/{analisis_id}/
GET    /api/dashboard/weekly-comparison/
GET    /api/dashboard/weekly-comparison/{consumidor_id}/
```

### **Other Available Endpoints** ✅
- **Deseos** (desires)
- **Emociones** (emotions)
- **Habitos** (habits)
- **Lecturas** (readings)
- **Motivos** (motives)
- **Notificaciones** (notifications)
- **Permisos** (permissions)
- **Soluciones** (solutions)
- **Ventanas** (windows)
- **Analisis** (analysis)
- **Formularios-temporales** (temporary forms)

---

## 🔐 Authentication Flow (Updated)

### **Registration Flow**
```
1. User fills registration form
2. POST /api/usuarios/register
   Body: { nombre, email, password, telefono, rol: "consumidor" }
3. Backend returns: { token, user, expires_in }
4. Auto-login with returned token
5. Create consumidor record: POST /api/consumidores/
   Body: { usuario_id, edad, peso, altura }
6. Create formularios record: POST /api/formularios/
   Body: { usuario_id, ...questionnaire data }
7. Redirect to /dashboard
```

### **Login Flow**
```
1. User enters email/password
2. POST /api/usuarios/login
   Body: { email, password }
3. Backend returns: { token, user, expires_in }
4. Store token + user data
5. Redirect based on rol:
   - "administrador" → /admin/dashboard
   - "consumidor" → /dashboard
```

---

## ⚠️ Important Notes

### **Token Refresh**
- ❌ **Not available in backend**
- When token expires, user must re-login
- Future implementation recommended for better UX

### **Logout Endpoint**
- ❌ **Not available in backend**
- Frontend handles logout by clearing localStorage
- No server-side token invalidation

### **Physical Data Storage**
- ✅ Store in `consumidores` table directly
- Fields: `usuario_id`, `edad`, `peso`, `altura`
- Use POST /api/consumidores/ on registration
- Use PATCH /api/consumidores/{id}/ for updates

### **Dashboard Endpoints**
- ✅ **Only GET methods used** (as requested)
- No POST/PUT/PATCH/DELETE needed for dashboard
- All dashboard data is read-only from frontend

---

## 📝 Updated Backend Requirements

### **Minimum Required for Authentication**
```javascript
POST /api/usuarios/login
// Request: { email: string, password: string }
// Response: { token: string, user: object, expires_in?: number }

POST /api/usuarios/register
// Request: { nombre, email, password, telefono?, rol? }
// Response: { token: string, user: object, expires_in?: number }
```

### **User Object Structure**
```javascript
{
  id: number,
  nombre: string,
  email: string,
  telefono: string | null,
  rol: "administrador" | "consumidor",
  created_at: string,
  updated_at: string
}
```

### **Token Format**
```
Authorization: Bearer <token>
```

---

## ✅ Frontend Changes Complete

All frontend code has been updated to match the actual backend API endpoints. The authentication system now works with:

1. ✅ Correct login endpoint: `/api/usuarios/login`
2. ✅ Correct register endpoint: `/api/usuarios/register`
3. ✅ Correct consumidores endpoint: `/api/consumidores/`
4. ✅ Correct formularios endpoint: `/api/formularios/`
5. ✅ Dashboard uses only GET methods

---

## 🧪 Testing Recommendations

### **1. Test Login**
```bash
POST /api/usuarios/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

Expected Response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "nombre": "Admin User",
    "email": "admin@example.com",
    "rol": "administrador",
    ...
  },
  "expires_in": 3600
}
```

### **2. Test Registration**
```bash
POST /api/usuarios/register
{
  "nombre": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "telefono": "1234567890",
  "rol": "consumidor"
}

Expected: Same response as login
```

### **3. Test Consumidor Creation**
```bash
POST /api/consumidores/
Headers: { "Authorization": "Bearer <token>" }
{
  "usuario_id": 2,
  "edad": 25,
  "peso": 70.5,
  "altura": 175
}

Expected: Created consumidor object
```

---

## 🎯 Next Steps

1. ✅ **Backend API is ready** - All required endpoints exist
2. ✅ **Frontend is aligned** - Using correct endpoints
3. 🔄 **Test end-to-end** - Verify login → register → onboarding flow
4. 🔄 **Implement dashboards** - Use GET dashboard endpoints
5. 📝 **Consider adding** - Token refresh endpoint for better UX

---

**Updated:** November 4, 2025  
**Status:** ✅ Backend API Aligned  
**Ready for:** End-to-end testing
