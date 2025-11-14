const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { 
    completeRegistrationForm, 
    completePhysicalDataForm,
    captureErrorScreenshot 
} = require('./helpers.cjs');

describe('Physical Data Form', function() {
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

    it('should complete registration and physical data form successfully', async function() {
        this.timeout(90000);
        
        try {
            console.log('\n========== TEST: REGISTRO + DATOS FÍSICOS ==========');
            
            // Paso 1: Registro
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página de login cargada');
            
            await completeRegistrationForm(driver);
            await driver.wait(until.urlContains('physical-data'), 15000);
            console.log('✓ Redirigido a datos físicos');
            
            // Paso 2: Datos Físicos
            await completePhysicalDataForm(driver);
            await driver.wait(until.urlContains('habitos'), 15000);
            
            const currentUrl = await driver.getCurrentUrl();
            console.log(`✓ Datos físicos guardados - Redirigido a: ${currentUrl}`);
            console.log('=====================================================\n');
            
        } catch (error) {
            await captureErrorScreenshot(driver, 'error-physical-data.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });
});