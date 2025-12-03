# Instalación y Ejecución de OWASP ZAP desde Código Fuente

## 1. Prerrequisitos
- Java JDK 11+
- Git
- Gradle (opcional, el wrapper `gradlew` viene incluido)

## 2. Clonar Repositorios
```bash
mkdir zap-source
cd zap-source
git clone https://github.com/zaproxy/zaproxy.git
git clone https://github.com/zaproxy/zap-extensions.git
git clone https://github.com/zaproxy/zap-hud.git
git clone https://github.com/zaproxy/zap-core-help.git
```

## 3. Estructura de Carpetas
La estructura recomendada para el desarrollo es que todos los repositorios estén en el mismo nivel:
```
zap-source/
  ├── zap-core-help/
  ├── zap-extensions/
  ├── zap-hud/
  └── zaproxy/
```

## 4. Construir y Ejecutar (Dev Build)
```bash
cd zaproxy
# En Windows
./gradlew.bat run
# En Linux/Mac
./gradlew run
```

## 5. Instalar Add-ons
Una vez que ZAP inicie (GUI):
1. Ir a `Manage Add-ons` (Ctrl+U).
2. Instalar obligatoriamente:
   - **Script Console**
   - **Zest - The ZAP Scripting Language**
   - **Selenium** (para navegación SPA)
   - **Spider** y **Ajax Spider**
3. Instalar opcionalmente:
   - **Python Scripting** (si prefieres scripts en Python dentro de ZAP)

## 6. Configuración para Scripts
Asegúrate de que los scripts generados en `c:\Wearable\Proyecto-9B-FE\security\scripts` sean accesibles por ZAP.
Puedes agregarlos manualmente en la pestaña "Scripts" o cargarlos vía API como hace el script `zap_scan.py`.
