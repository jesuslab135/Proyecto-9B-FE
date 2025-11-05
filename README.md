# Actionless (Addictless) - Frontend

A comprehensive React application for habit tracking and addiction management with JWT authentication, role-based access control, and a beautiful UI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Quick reference guide for getting started
- **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)** - Complete authentication documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Detailed implementation summary
- **[useAuth.examples.md](src/hooks/useAuth.examples.md)** - React hook usage examples

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Consumer)
- ✅ Token refresh mechanism
- ✅ Secure token storage
- ✅ Protected routes
- ✅ Auto-redirect based on user role

### User Management
- ✅ Login/Register with validation
- ✅ User profile management
- ✅ Onboarding flow (Physical data + Questionnaire)
- ✅ Password reset (coming soon)

### Technical Features
- ✅ OOP architecture with Singleton pattern
- ✅ Frontend logging system
- ✅ Error handling without crashes
- ✅ Custom React hooks (useAuth)
- ✅ Axios interceptors for automatic token injection
- ✅ Responsive design
- ✅ Animated UI transitions

## 🏗️ Project Structure

```
src/
├── services/              # Core business logic (Singleton pattern)
│   ├── Logger.js         # Frontend logging
│   ├── StorageService.js # Token & data storage
│   └── AuthService.js    # Authentication logic
├── components/
│   ├── Auth/             # Authentication components
│   ├── Login_Register_components/
│   ├── Onboarding/       # User onboarding forms
│   ├── Home_components/
│   ├── KPI/
│   └── UI/               # Shared UI components
├── hooks/
│   ├── useAuth.js        # Authentication hook
│   └── useAuth.examples.md
├── pages/                # Page components
├── utils/
│   └── api/              # API clients and utilities
└── styles/               # CSS files
```

## 🔐 Authentication Flow

### Registration
```
User fills form → POST /auth/register → Auto-login → Onboarding → Dashboard
```

### Login
```
User enters credentials → POST /auth/login → Store token → Redirect by role
```

### Token Management
```
Token stored → Auto-attached to requests → Auto-refresh on expiry → Logout on failure
```

## 🛣️ Routes

### Public Routes
- `/` - Home page
- `/login` - Login/Register page

### Protected Routes (Requires Authentication)
- `/onboarding/physical-data` - Physical data form
- `/onboarding/formularios` - Questionnaire form

### Role-Based Routes
- `/dashboard` - Consumer dashboard (role: "consumidor")
- `/admin/dashboard` - Admin dashboard (role: "administrador")

## 🔌 Backend API Requirements

Your backend must implement these endpoints:

```javascript
// Authentication
POST   /auth/login         // Login user
POST   /auth/register      // Register new user
POST   /auth/refresh       // Refresh token
POST   /auth/logout        // Logout user

// User Management
GET    /usuarios/:id       // Get user profile
PATCH  /usuarios/:id       // Update user profile

// Physical Data
POST   /consumidores/:id/datos-fisicos  // Save physical data
GET    /consumidores/:id/datos-fisicos  // Get physical data

// Formularios
POST   /formularios        // Save questionnaire
GET    /formularios/:userId // Get questionnaire
```

## 💻 Usage Examples

### Using the useAuth Hook

```javascript
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Welcome, {user.nombre}!</h1>
      {isAdmin && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Using AuthService Directly

```javascript
import { authService } from './services/AuthService';

const result = await authService.login(email, password);
if (result.success) {
  navigate(result.redirectTo); // Auto-redirect based on role
}
```

### Protected Routes

```javascript
import ProtectedRoute from './components/Auth/ProtectedRoute';

<ProtectedRoute requiredRole="administrador">
  <AdminDashboard />
</ProtectedRoute>
```

## 🎨 Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Boxicons** - Icons
- **CSS3** - Styling with animations

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x"
}
```

## 🧪 Testing

See [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) for complete testing instructions.

### Quick Test Checklist
- [ ] Register new user
- [ ] Login with credentials
- [ ] Complete onboarding forms
- [ ] Access protected routes
- [ ] Test role-based access
- [ ] Logout and verify token cleared

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Database Schema

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

## 🐛 Troubleshooting

### Common Issues

**Login button doesn't work**
- Check browser console for errors
- Verify backend is running
- Check CORS configuration

**Token not being sent to backend**
- Check axios interceptor in `src/utils/api/https.js`
- Verify token is stored in localStorage

**Cannot access protected routes**
- Check authentication status with `authService.isAuthenticated()`
- Verify token hasn't expired

See [QUICK_START.md](QUICK_START.md) for more solutions.

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎯 Next Steps

1. **Implement dashboards** - Consumer and Admin dashboards
2. **Profile page** - View and edit user data
3. **Password reset** - Forgot password flow
4. **Email verification** - Verify user emails
5. **Testing** - Unit and integration tests

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Related Projects

- **Backend:** [Simulador-0910/WearableApi](https://github.com/FaexAS31/Simulador-0910/tree/main/WearableApi)

## 👥 Authors

- Proyecto 9B Team
- Branch: Olmos

## 📞 Support

For questions or issues, please refer to the documentation files or create an issue in the repository.

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready (pending backend integration)  
**Last Updated:** November 4, 2025
