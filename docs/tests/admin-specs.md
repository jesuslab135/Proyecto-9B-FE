# Documentación de los tests E2E (Selenium) — Proyecto-9B-FE

Última actualización: 14-11-2025

Este documento describe en detalle los tests E2E presentes en `src/specs/` y el helper compartido en `src/specs/helpers.cjs`. Incluye: propósito, requisitos, cómo ejecutarlos, explicación línea a línea de los casos y recomendaciones para estabilizarlos o migrarlos.

## Requisitos previos

- Node.js instalado y dependencias del proyecto instaladas (`npm install`).
- Chrome instalado y `chromedriver` disponible en `node_modules` (la suite usa `require('chromedriver').path`).
- La aplicación debe estar en ejecución en `http://localhost:5173` a menos que uses la variable de entorno `TEST_BASE_URL`.
- Variables de entorno útiles:
  - `TEST_BASE_URL` — URL base de la app (por defecto `http://localhost:5173`).
  - `ADMIN_EMAIL` / `ADMIN_PASS` — credenciales para el login de administrador usado por `admin.test.cjs`.

## Ubicación de los tests

- `src/specs/register.test.cjs` — Test de registro de usuario (flujo de registro simple).
- `src/specs/physical-data.test.cjs` — Test que realiza registro + completa formulario de datos físicos.
- `src/specs/formularios.test.cjs` — Test de flujo completo: registro → datos físicos → formularios/hábitos → resultados → dashboard.
- `src/specs/admin.test.cjs` — Test agregado que cubre CRUD (crear/editar/eliminar) para recursos del admin: emociones, hábitos y motivos.
- `src/specs/helpers.cjs` — Funciones auxiliares reutilizables por los tests (generación de datos, completado de formularios, login admin, captura de screenshots).

## Cómo ejecutar los tests (PowerShell)

Ejecutar un test individual con Mocha (suponiendo Mocha está instalado localmente):

```powershell
node ./node_modules/mocha/bin/mocha src\specs\register.test.cjs --timeout 60000
```

Comando ejemplo para el test admin (aumentar timeout y setear credenciales):

```powershell
$env:TEST_BASE_URL='http://localhost:5173'; $env:ADMIN_EMAIL='admin@local'; $env:ADMIN_PASS='secret'; node ./node_modules/mocha/bin/mocha src\specs\admin.test.cjs --timeout 180000
```

Nota: si no usas Mocha, adapta al runner que prefieras. Los archivos `.cjs` usan CommonJS y están listos para Mocha/Jest (con configuración compatible).

## Resumen de `helpers.cjs`

Ruta: `src/specs/helpers.cjs` — funciones principales exportadas:

- `generateUniqueEmail()` — devuelve un email único basado en timestamp + número aleatorio.
- `generateRandomName(), generateRandomPhone(), generateRandomPassword()` — generadores de datos para el registro.
- `completeRegistrationForm(driver, customData)` — realiza los pasos para abrir el formulario de registro y completarlo (click en `.register-btn`, llenar inputs y enviar).
- `completePhysicalDataForm(driver, customData)` — espera a campos `#edad`, `#peso`, `#altura` y los completa.
- `completeFormulariosForm(driver, customData)` — heurística compleja que detecta si el formulario es de checkboxes o selects; selecciona opciones aleatorias y envía.
- `completeFormulariosFormSelects(driver)` — versión enfocada a formularios con `selects` (perfil de usuario, slider, campos opcionales).
- `completeResultsPage(driver)` — espera la página de resultados y hace click en el botón `Siguiente`.
- `captureErrorScreenshot(driver, filename)` — captura screenshot en caso de fallo.
- `loginAsAdmin(driver, creds)` — nuevo helper añadido: navega a `/login`, rellena credenciales (desde `creds` o `ADMIN_EMAIL`/`ADMIN_PASS`) y envía login.

Cada función usa `selenium-webdriver` y mezcla `driver.wait(until.elementLocated(...))` con `driver.sleep(...)`. Recomendación general: reducir los `sleep` y confiar más en `until` para estabilidad.

## Detalle de cada spec y su código (explicación)

### `register.test.cjs`

Propósito: validar que el flujo de registro redirige correctamente al onboarding.

Flujo principal:

1. Construye un `WebDriver` para Chrome usando `chromedriver`.
2. Visita `http://localhost:5173/login`.
3. Clic en botón `.register-btn` para mostrar el formulario de registro.
4. Rellena `input[name="nombre"]`, `input[name="email"]`, `input[name="telefono"]`, `input[name="password"]` usando un email único (`Date.now()`).
5. Envía el formulario y espera que la URL contenga `onboarding`.
6. Captura screenshot y lanza error si algo falla.

Puntos importantes del código:

- Usa `driver.sleep(2000)` tras cargar la página y pequeñas esperas en pasos intermedios — esto es fuente de flakiness.
- Verifica la redirección por URL, no por contenido del DOM.

Fragmento clave (simplificado):

```javascript
await driver.get('http://localhost:5173/login');
await driver.findElement(By.css('.register-btn')).click();
await driver.findElement(By.css('.form-box.register input[name="email"]')).sendKeys(testEmail);
await driver.findElement(By.css('.form-box.register button[type="submit"]')).click();
await driver.wait(until.urlContains('onboarding'), 15000);
```

### `physical-data.test.cjs`

Propósito: validar el flujo que completa los datos físicos después del registro (edad, peso, altura) y que redirige a `habitos`.

Uso:

- Importa helpers: `completeRegistrationForm` y `completePhysicalDataForm` para componer el flujo.
- Realiza `driver.get(...)`, `completeRegistrationForm(driver)`, espera URL con `physical-data`, luego `completePhysicalDataForm(driver)` y espera `habitos`.

Puntos a mejorar:

- Añadir asserts que verifiquen contenido específico en la página `physical-data` y no solo la URL.

### `formularios.test.cjs`

Propósito: validar el flujo completo incluyendo formularios/hábitos y la página de resultados hasta la redirección al dashboard.

Flujo:

1. Registro (helpers)
2. Datos físicos (helpers)
3. Formularios/hábitos con `completeFormulariosForm` (detecta checkboxes o selects)
4. Resultados con `completeResultsPage`
5. Espera redirección a `dashboard`.

Observaciones:

- Este test es el más largo y tiene mayor probabilidad de fallos por timeouts o cambios de UI. Considerar dividirlo en tests más pequeños.

### `admin.test.cjs` (nuevo)

Propósito: validar las operaciones CRUD básicas expuestas por la UI de administración para recursos creados en el proyecto.

Flujo implementado:

1. `loginAsAdmin(driver)` — logueo con credenciales de admin.
2. Para cada recurso (`emociones`, `habitos`, `motivos`) realiza:
   - Navegar a `/admin/<resource>`
   - Hacer click en `Crear`, llenar campos (según un mapeo) y enviar.
   - Verificar que el nuevo ítem aparece en la lista (busca un `div` que contenga el texto creado).
   - Hacer click en `Editar`, modificar campos y enviar.
   - Verificar que el ítem actualizado aparece.
   - Hacer click en `Eliminar` y verificar que el ítem desaparece.

Detalles técnicos:

- El test crea nombres únicos usando `Date.now()` para evitar colisiones.
- Usa XPaths para localizar botones `Crear`/`Editar`/`Eliminar` dentro del contenedor del recurso.
- Captura `error-admin-screenshot.png` en caso de fallo.

Limitaciones conocidas:

- El test asume estructura renderizada por `src/components/admin/CrudList.jsx` y `CrudForm.jsx` (por ejemplo, clases `p-3` y enlaces con texto `Crear`/`Editar`). Si la UI cambia, los selectores fallarán.
- No hay limpieza de datos vía API, el delete se realiza desde la UI; si falla el delete, los datos quedan en backend.

## Recomendaciones para estabilizar y mejorar

1. Reemplazar `sleep()` por esperas explícitas:
   - `driver.wait(until.elementLocated(...))`, `until.elementIsVisible`, `until.elementIsEnabled`.
2. Introducir assertions explícitas con `assert` o `chai` para comprobar contenido/estado (no confiar solo en `urlContains`).
3. Añadir `data-testid` en la app para elementos clave (botones, inputs) y usarlos como selectores estables en los tests.
4. Ejecutar Chrome en `headless` en CI añadiendo options: `new chrome.Options().headless().addArguments('--no-sandbox','--disable-gpu')`.
5. Añadir un `test/config.js` para centralizar `TEST_BASE_URL`, `DEFAULT_TIMEOUT_MS`, y opciones de navegador.
6. Añadir un script o endpoint de test en el backend que permita borrar usuarios de prueba por email (cleanup).
7. Considerar migrar a Playwright o Cypress para menor mantenimiento y mejores herramientas de depuración.

## Ejemplos de ejecución (PowerShell) y variables útiles

Ejecutar solo el test admin con credenciales y URL específicas:

```powershell
$env:TEST_BASE_URL='http://localhost:5173'
$env:ADMIN_EMAIL='admin@local'
$env:ADMIN_PASS='secret'
node ./node_modules/mocha/bin/mocha src\specs\admin.test.cjs --timeout 180000
```

Ejecutar todos los specs:

```powershell
node ./node_modules/mocha/bin/mocha "src\specs\*.cjs" --timeout 180000
```

## Notas finales

- Estos tests están diseñados siguiendo el patrón ya existente en el repo (Selenium + chromedriver). Son funcionales para pruebas locales o en entornos donde Chrome y chromedriver están disponibles.
- Si quieres, puedo:
  - Modificar los tests para que usen `headless` y opciones CI-ready.
  - Reemplazar los `sleep` por esperas explícitas en todos los archivos.
  - Añadir assertions concretas (`assert`) a los tests para que fallen de forma más determinista cuando la UI no muestre el estado esperado.

Indica cuál de estas mejoras quieres que aplique y la aplicaré en el siguiente paso.

*** Fin de documento
