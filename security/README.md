# Sistema de Pruebas de Seguridad OWASP ZAP

Este directorio contiene la configuración completa para realizar pruebas de seguridad automatizadas (DAST) en la aplicación React + Django.

## Estructura del Proyecto

```
/security
    /scripts
        auth_user.js          # Script de autenticación para Usuario Normal
        auth_admin.js         # Script de autenticación para Administrador
        session_user.js       # Script HTTP Sender para inyectar JWT de Usuario
        session_admin.js      # Script HTTP Sender para inyectar JWT de Admin
        zest_user_normal.zst  # Script de navegación Zest para Usuario
        zest_admin_panel.zst  # Script de navegación Zest para Admin
        zap_scan.py           # Script de control para orquestar ZAP
    /contexts
        user_context.context  # Definición del contexto de Usuario
        admin_context.context # Definición del contexto de Admin
    /reports
        (Aquí se guardarán los reportes HTML y JSON)
    /mocks
        responses.json        # Ejemplos de respuestas API para referencia
    ZAP_SETUP.md              # Instrucciones de instalación de ZAP desde fuente
```

## Flujo Completo de Ejecución

### 1. Inicio de ZAP
El script `zap_scan.py` (o el pipeline CI/CD) inicia ZAP en modo daemon (headless) o se conecta a una instancia existente.

### 2. Carga de Recursos
- Se cargan los scripts de autenticación (`auth_*.js`) y de sesión (`session_*.js`) en ZAP.
- Se importan los contextos (`*.context`) que definen el alcance (scope), las URLs a incluir/excluir y la configuración de usuarios.

### 3. Autenticación
Cuando ZAP necesita acceder a una URL protegida:
1. **Detección**: ZAP identifica que no está autenticado (basado en los indicadores de "Logged Out" definidos en el contexto).
2. **Ejecución**: Llama a la función `authenticate()` del script `auth_*.js`.
3. **Login**: El script envía un POST a `/api/login/` con las credenciales del usuario.
4. **Extracción**: Parsea la respuesta JSON y extrae el token JWT.
5. **Almacenamiento**: Guarda el token en una variable global (`USER_JWT` o `ADMIN_JWT`).

### 4. Gestión de Sesión (Inyección de Token)
Para cada petición HTTP que ZAP realiza (Spider, Active Scan, Zest):
1. El script `session_*.js` (tipo HTTP Sender) intercepta la petición antes de enviarse.
2. Verifica si existe un token en la variable global.
3. Si la URL es del API, inyecta el header `Authorization: Bearer <token>`.

### 5. Navegación y Escaneo
- **Spider**: Navega por la aplicación descubriendo endpoints. Gracias a la inyección del token, puede acceder a rutas privadas.
- **Zest Scripts**: Guían al scanner por flujos específicos (ej. llenar formularios) para asegurar que se pruebe la lógica de negocio profunda.
- **Active Scan**: Ataca los endpoints descubiertos buscando vulnerabilidades (XSS, SQLi, etc.) usando el usuario autenticado.

### 6. Reportes
Al finalizar, se generan reportes en HTML y JSON en la carpeta `/reports`, separados por rol (Usuario y Admin).

### 7. CI/CD
El archivo `.github/workflows/zap_scan.yml` automatiza todo este proceso en cada push a `main`, fallando el build si se encuentran vulnerabilidades de alto riesgo.

## Ejecución Manual

1. Asegúrate de tener ZAP corriendo (puerto 8080).
2. Instala la librería de Python: `pip install python-owasp-zap-v2`
3. Ejecuta el script de control:
   ```bash
   python security/scripts/zap_scan.py
   ```
