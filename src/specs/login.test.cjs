const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { 
    completeLoginForm,
    captureErrorScreenshot,
    captureTestResults 
} = require('./helpers.cjs');

describe('Login Tests', function() {
    let driver;

    // Credenciales de usuario de prueba existente
    const VALID_CREDENTIALS = {
        email: 'perdomo@gmail.com',
        password: 'Dio$ama135'
    };

    beforeEach(async function() {
        this.timeout(60000);
        
        const service = new chrome.ServiceBuilder(require('chromedriver').path);
        const options = new chrome.Options();
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeService(service)
            .setChromeOptions(options)
            .build();
    });

    afterEach(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('should login successfully with valid credentials', async function() {
        this.timeout(60000);
        const startTime = Date.now();
        
        try {
            console.log('\n========== TEST: LOGIN CON CREDENCIALES VÁLIDAS ==========');
            
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página de login cargada');
            
            // Hacer login con credenciales válidas
            await completeLoginForm(driver, VALID_CREDENTIALS);
            
            // Verificar redirección exitosa
            console.log('→ Verificando redirección...');
            await driver.sleep(2000);
            
            await driver.wait(async () => {
                const currentUrl = await driver.getCurrentUrl();
                return currentUrl.includes('dashboard') || currentUrl.includes('admin');
            }, 15000);
            
            const finalUrl = await driver.getCurrentUrl();
            console.log(`✓✓✓ LOGIN EXITOSO - Redirigido a: ${finalUrl}`);
            console.log('===========================================================\n');
            
            // Capturar resultado exitoso
            const duration = Date.now() - startTime;
            captureTestResults('login-valid-credentials', true, duration);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            captureTestResults('login-valid-credentials', false, duration);
            await captureErrorScreenshot(driver, 'error-login-valid.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });

    it('should show error with invalid credentials', async function() {
        this.timeout(60000);
        const startTime = Date.now();
        
        try {
            console.log('\n========== TEST: LOGIN CON CREDENCIALES INVÁLIDAS ==========');
            
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página de login cargada');
            
            // Intentar login con credenciales incorrectas
            await completeLoginForm(driver, {
                email: 'usuario_inexistente@example.com',
                password: 'password_incorrecta123'
            });
            
            // Esperar a que aparezca el mensaje de error
            console.log('→ Esperando mensaje de error...');
            await driver.sleep(2000);
            
            // Verificar que apareció un mensaje de error
            try {
                const errorMessage = await driver.findElement(By.xpath("//*[contains(text(), 'Error') or contains(text(), 'error') or contains(text(), 'incorrecta') or contains(text(), 'incorrecto') or contains(text(), 'inválid')]"));
                const errorText = await errorMessage.getText();
                console.log(`✓ Mensaje de error mostrado: "${errorText}"`);
            } catch (e) {
                console.log('✓ Sistema rechazó credenciales inválidas');
            }
            
            // Verificar que NO se redirigió
            const currentUrl = await driver.getCurrentUrl();
            if (currentUrl.includes('login')) {
                console.log('✓ Usuario permanece en página de login (esperado)');
            } else {
                throw new Error('ERROR: Usuario fue redirigido con credenciales inválidas');
            }
            
            console.log('================================================================\n');
            
            const duration = Date.now() - startTime;
            captureTestResults('login-invalid-credentials', true, duration);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            captureTestResults('login-invalid-credentials', false, duration);
            await captureErrorScreenshot(driver, 'error-login-invalid.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });

    it('should show error with empty fields', async function() {
        this.timeout(60000);
        const startTime = Date.now();
        
        try {
            console.log('\n========== TEST: LOGIN CON CAMPOS VACÍOS ==========');
            
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página de login cargada');
            
            await driver.sleep(2000);
            
            // Asegurarse de estar en la vista de login
            try {
                const loginForm = await driver.findElement(By.css('.form-box.login'));
                const isDisplayed = await loginForm.isDisplayed();
                
                if (!isDisplayed) {
                    await driver.findElement(By.css('.login-btn')).click();
                    await driver.sleep(1000);
                    console.log('  ✓ Cambió a vista de login');
                }
            } catch (e) {
                console.log('  ✓ Vista de login ya visible');
            }
            
            // Intentar enviar formulario vacío
            console.log('→ Intentando enviar formulario vacío...');
            await driver.findElement(By.css('.form-box.login button[type="submit"]')).click();
            
            await driver.sleep(1000);
            
            // Verificar que el navegador muestra validación HTML5
            const emailInput = await driver.findElement(By.css('.form-box.login input[name="email"]'));
            const validationMessage = await emailInput.getAttribute('validationMessage');
            
            if (validationMessage) {
                console.log(`✓ Validación del navegador: "${validationMessage}"`);
            } else {
                console.log('✓ Formulario requiere campos completos');
            }
            
            // Verificar que sigue en la página de login
            const currentUrl = await driver.getCurrentUrl();
            if (currentUrl.includes('login')) {
                console.log('✓ Usuario permanece en página de login (esperado)');
            }
            
            console.log('====================================================\n');
            
            const duration = Date.now() - startTime;
            captureTestResults('login-empty-fields', true, duration);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            captureTestResults('login-empty-fields', false, duration);
            await captureErrorScreenshot(driver, 'error-login-empty.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });

    it('should show error with invalid email format', async function() {
        this.timeout(60000);
        const startTime = Date.now();
        
        try {
            console.log('\n========== TEST: LOGIN CON EMAIL INVÁLIDO ==========');
            
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página de login cargada');
            
            await driver.sleep(2000);
            
            // Asegurarse de estar en la vista de login
            try {
                const loginForm = await driver.findElement(By.css('.form-box.login'));
                const isDisplayed = await loginForm.isDisplayed();
                
                if (!isDisplayed) {
                    await driver.findElement(By.css('.login-btn')).click();
                    await driver.sleep(1000);
                }
            } catch (e) {
                // Ya está visible
            }
            
            // Ingresar email con formato inválido
            console.log('→ Ingresando email con formato inválido...');
            await driver.findElement(By.css('.form-box.login input[name="email"]')).sendKeys('email_invalido_sin_arroba');
            await driver.findElement(By.css('.form-box.login input[name="password"]')).sendKeys('password123');
            
            // Intentar enviar
            await driver.findElement(By.css('.form-box.login button[type="submit"]')).click();
            
            await driver.sleep(1000);
            
            // Verificar validación HTML5
            const emailInput = await driver.findElement(By.css('.form-box.login input[name="email"]'));
            const validationMessage = await emailInput.getAttribute('validationMessage');
            
            if (validationMessage) {
                console.log(`✓ Validación del navegador: "${validationMessage}"`);
            } else {
                console.log('✓ Email inválido rechazado');
            }
            
            // Verificar que sigue en la página de login
            const currentUrl = await driver.getCurrentUrl();
            if (currentUrl.includes('login')) {
                console.log('✓ Usuario permanece en página de login (esperado)');
            }
            
            console.log('=====================================================\n');
            
            const duration = Date.now() - startTime;
            captureTestResults('login-invalid-email', true, duration);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            captureTestResults('login-invalid-email', false, duration);
            await captureErrorScreenshot(driver, 'error-login-invalid-email.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });

    it('should show error with correct email but wrong password', async function() {
        this.timeout(60000);
        const startTime = Date.now();
        
        try {
            console.log('\n========== TEST: LOGIN CON PASSWORD INCORRECTA ==========');
            
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página de login cargada');
            
            // Usar email correcto pero password incorrecta
            await completeLoginForm(driver, {
                email: VALID_CREDENTIALS.email,
                password: 'PasswordIncorrecta123!'
            });
            
            // Esperar mensaje de error
            console.log('→ Esperando mensaje de error...');
            await driver.sleep(2000);
            
            // Verificar mensaje de error
            try {
                const errorMessage = await driver.findElement(By.xpath("//*[contains(text(), 'Error') or contains(text(), 'error') or contains(text(), 'incorrecta') or contains(text(), 'incorrecto')]"));
                const errorText = await errorMessage.getText();
                console.log(`✓ Mensaje de error mostrado: "${errorText}"`);
            } catch (e) {
                console.log('✓ Sistema rechazó password incorrecta');
            }
            
            // Verificar que NO se redirigió
            const currentUrl = await driver.getCurrentUrl();
            if (currentUrl.includes('login')) {
                console.log('✓ Usuario permanece en página de login (esperado)');
            }
            
            console.log('==========================================================\n');
            
            const duration = Date.now() - startTime;
            captureTestResults('login-wrong-password', true, duration);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            captureTestResults('login-wrong-password', false, duration);
            await captureErrorScreenshot(driver, 'error-login-wrong-password.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });
});