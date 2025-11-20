# 🔍 Debug Guide - Authentication 401 Error

## Problema
- Status code 401 en peticiones autenticadas
- Swagger no permite acceso sin autenticación

## Pasos para Debuggear

### 1. Verificar el Token en localStorage

Abre la consola del navegador y ejecuta:

```javascript
// Ver el token almacenado
console.log('Token:', localStorage.getItem('auth_token'));

// Ver si está expirado
console.log('Expiry:', localStorage.getItem('token_expiry'));
console.log('Current time:', Date.now());
console.log('Is expired?', Date.now() > parseInt(localStorage.getItem('token_expiry')));

// Ver user data
console.log('User:', JSON.parse(localStorage.getItem('user_data')));
```

### 2. Hacer Login y Ver la Respuesta

Después de hacer login, verifica en la consola:

```
🔍 Backend login response: { token: "...", user: {...}, expires_in: 3600 }
💾 Storing token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
⏰ Token expires in: 3600 seconds
```

### 3. Verificar Peticiones HTTP

En las peticiones siguientes deberías ver:

```
🔑 Sending token: eyJhbGciOiJIUzI1NiIsI...
```

### 4. Verificar el Backend (Django)

#### Opción A: Permitir Swagger sin autenticación

En tu `settings.py` de Django:

```python
# Para desarrollo, permite acceso a docs sin auth
SPECTACULAR_SETTINGS = {
    'SERVE_PERMISSIONS': ['rest_framework.permissions.AllowAny'],
    # ... otras settings
}
```

#### Opción B: Configurar Swagger con Bearer Token

En Swagger UI:
1. Click en "Authorize" (botón verde con candado)
2. Ingresa: `Bearer tu_token_aqui`
3. Click "Authorize"

### 5. Verificar el Formato del Token en Django

Tu backend debería devolver:

```python
{
    "token": "eyJhbGciOiJIUzI1...",  # JWT token
    "refresh_token": "eyJhbGciOiJ...",  # Opcional
    "user": {
        "id": 1,
        "email": "user@example.com",
        "nombre": "Usuario",
        "rol": "consumidor"
    },
    "expires_in": 3600  # Opcional: segundos hasta expirar
}
```

### 6. Problema Común: Token sin prefijo "Bearer"

Si el backend no acepta tokens, verifica que:

**Frontend (ya está correcto):**
```javascript
cfg.headers.Authorization = `Bearer ${token}`;
```

**Backend Django debe aceptar:**
```python
# En settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # o
        'rest_framework.authentication.TokenAuthentication',
    ],
}
```

### 7. Test Manual con curl

Prueba el endpoint manualmente:

```bash
# Login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Usar el token (copia el token del response anterior)
curl -X GET http://localhost:8000/api/usuarios/ \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 8. Verificar CORS

Si ves errores de CORS, en Django `settings.py`:

```python
CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo
# O específico:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## Soluciones Comunes

### Si el token no se guarda:
```javascript
// Limpiar localStorage
localStorage.clear();

// Hacer login nuevamente
// Ver consola para logs: 💾 Storing token...
```

### Si el token expira inmediatamente:
- El backend está devolviendo `expires_in` muy bajo
- Verifica el tiempo de expiración en Django JWT settings

### Si Swagger no funciona:
```python
# settings.py
SPECTACULAR_SETTINGS = {
    'TITLE': 'WearableApi API',
    'DESCRIPTION': 'API Documentation',
    'VERSION': '1.0.0',
    'SERVE_PERMISSIONS': ['rest_framework.permissions.AllowAny'],  # ← Agregar esto
}
```

## Checklist Final

- [ ] Login exitoso muestra `💾 Storing token` en consola
- [ ] Token visible en localStorage con `auth_token`
- [ ] Peticiones muestran `🔑 Sending token` en consola
- [ ] No hay errores 401 en peticiones autenticadas
- [ ] Swagger permite acceso o acepta Bearer token
