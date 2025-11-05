# useAuth Hook - Usage Examples

## Basic Usage

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.nombre}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.rol}</p>
      
      {isAdmin && (
        <div>
          <h2>Admin Features</h2>
          <button>Manage Users</button>
        </div>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Available Properties

```javascript
const {
  // State
  user,              // Current user object { id, nombre, email, rol, ... }
  isAuthenticated,   // Boolean: true if user is logged in
  isLoading,         // Boolean: true during async operations
  
  // Role checks
  isAdmin,           // Boolean: true if user.rol === 'administrador'
  isConsumer,        // Boolean: true if user.rol === 'consumidor'
  
  // Methods
  login,             // async (email, password) => result
  register,          // async (userData) => result
  logout,            // () => void
  refreshToken,      // async () => result
  updateProfile,     // async (profileData) => result
  fetchUserProfile,  // async () => result
} = useAuth();
```

## Example 1: Get Current User

```javascript
const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>{user.nombre}</h1>
      <p>{user.email}</p>
      <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
    </div>
  );
};
```

## Example 2: Check Authentication Status

```javascript
const SecureComponent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return <div>Protected content</div>;
};
```

## Example 3: Role-Based UI

```javascript
const Dashboard = () => {
  const { isAdmin, isConsumer } = useAuth();
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {isAdmin && (
        <div>
          <h2>Admin Panel</h2>
          <button>Manage Users</button>
          <button>View Analytics</button>
        </div>
      )}

      {isConsumer && (
        <div>
          <h2>My Activities</h2>
          <button>Track Habits</button>
          <button>View Progress</button>
        </div>
      )}
    </div>
  );
};
```

## Example 4: Login Form

```javascript
const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate(result.redirectTo); // Auto-redirect based on role
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

## Example 5: Update Profile

```javascript
const EditProfile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [nombre, setNombre] = useState(user.nombre);
  const [telefono, setTelefono] = useState(user.telefono);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await updateProfile({ nombre, telefono });
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <div className="success">{success}</div>}
      
      <input 
        value={nombre} 
        onChange={(e) => setNombre(e.target.value)}
        disabled={isLoading}
      />
      
      <input 
        value={telefono} 
        onChange={(e) => setTelefono(e.target.value)}
        disabled={isLoading}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};
```

## Example 6: Logout Button

```javascript
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const result = logout();
    navigate(result.redirectTo); // Usually '/login'
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};
```

## Example 7: Registration Form

```javascript
const RegisterForm = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData);
    
    if (result.success) {
      // Auto-logged in, redirect to onboarding
      navigate('/onboarding/physical-data');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Name"
        value={formData.nombre}
        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
      />
      <input 
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input 
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
};
```

## Example 8: Conditional Navigation

```javascript
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      
      {isAuthenticated ? (
        <>
          <span>Hello, {user.nombre}</span>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};
```

## Example 9: Refresh User Data

```javascript
const ProfilePage = () => {
  const { user, fetchUserProfile, isLoading } = useAuth();

  useEffect(() => {
    // Fetch fresh user data when component mounts
    fetchUserProfile();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.nombre}</h1>
      <p>{user.email}</p>
    </div>
  );
};
```

## Example 10: Loading States

```javascript
const ActionButton = () => {
  const { isLoading, updateProfile } = useAuth();

  const handleAction = async () => {
    await updateProfile({ some: 'data' });
  };

  return (
    <button 
      onClick={handleAction} 
      disabled={isLoading}
      className={isLoading ? 'loading' : ''}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          Processing...
        </>
      ) : (
        'Save Changes'
      )}
    </button>
  );
};
```

## Tips

1. **Always check `isAuthenticated` before accessing `user`**
   ```javascript
   const { user, isAuthenticated } = useAuth();
   if (isAuthenticated) {
     console.log(user.nombre); // Safe
   }
   ```

2. **Handle loading states for better UX**
   ```javascript
   const { isLoading, login } = useAuth();
   // Disable buttons when isLoading is true
   ```

3. **Use role checks for conditional rendering**
   ```javascript
   const { isAdmin } = useAuth();
   {isAdmin && <AdminPanel />}
   ```

4. **Logout clears everything automatically**
   ```javascript
   logout(); // Clears tokens, user data, and redirects
   ```

5. **Subscribe to auth changes automatically**
   - The hook automatically updates when auth state changes
   - No manual re-fetching needed
