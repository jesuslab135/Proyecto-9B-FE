const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Register', function() {
    let driver;

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

    it('should register a new user successfully', async function() {
        this.timeout(60000);
        
        try {
            // 1. Ir a la página de login
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página cargada');
            await driver.sleep(2000);
            
            // 2. Hacer clic en el botón "Register"
            await driver.findElement(By.css('.register-btn')).click();
            console.log('✓ Botón Register clickeado');
            await driver.sleep(1000);
            
            // 3. Llenar el formulario con un email único (usando timestamp)
            const timestamp = Date.now();
            const testEmail = `test${timestamp}@gmail.com`;
            
            await driver.findElement(By.css('.form-box.register input[name="nombre"]')).sendKeys('Ray Parra Test');
            console.log('✓ Nombre ingresado');
            
            await driver.findElement(By.css('.form-box.register input[name="email"]')).sendKeys(testEmail);
            console.log('✓ Email ingresado:', testEmail);
            
            await driver.findElement(By.css('.form-box.register input[name="telefono"]')).sendKeys('6634563212');
            console.log('✓ Teléfono ingresado');
            
            await driver.findElement(By.css('.form-box.register input[name="password"]')).sendKeys('test1234');
            console.log('✓ Password ingresado');
            
            // 4. Hacer clic en submit
            await driver.findElement(By.css('.form-box.register button[type="submit"]')).click();
            console.log('✓ Formulario enviado');
            
            // 5. Esperar a ver si aparece mensaje de error o éxito
            await driver.sleep(2000);
            
            // Capturar la URL actual para debug
            const currentUrl = await driver.getCurrentUrl();
            console.log('URL actual:', currentUrl);
            
            // Intentar capturar mensaje de error si existe
            try {
                const pageSource = await driver.getPageSource();
                if (pageSource.includes('Error') || pageSource.includes('error')) {
                    console.log('⚠ Posible mensaje de error en la página');
                }
            } catch (e) {
                // Ignorar si no se puede obtener
            }
            
            // 6. Esperar redirección
            await driver.wait(until.urlContains('onboarding'), 15000);
            
            console.log('✓ Registro exitoso - Usuario redirigido a onboarding');
            
        } catch (error) {
            // Capturar screenshot en caso de error
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('error-screenshot.png', screenshot, 'base64');
            console.error('❌ Error capturado. Screenshot guardado como error-screenshot.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });
});