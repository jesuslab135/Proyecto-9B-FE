const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { 
    completeRegistrationForm, 
    completePhysicalDataForm,
    completeFormulariosForm,
    completeResultsPage, 
    captureErrorScreenshot,
    captureTestResults 
} = require('./helpers.cjs');

describe('Formularios Form - Complete Flow', function() {
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

    it('should complete full registration flow including formularios and results', async function() {
        this.timeout(180000);
        const startTime = Date.now();
        
        try {
            console.log('\n========== TEST: FLUJO COMPLETO (REGISTRO + FÍSICOS + HÁBITOS + RESULTADOS) ==========');
            
            // Paso 1: Registro
            await driver.get('http://localhost:5173/login');
            console.log('✓ Página de login cargada');
            
            await completeRegistrationForm(driver);
            await driver.wait(until.urlContains('physical-data'), 20000);
            console.log('✓ Redirigido a datos físicos');
            
            // Paso 2: Datos Físicos
            await completePhysicalDataForm(driver);
            await driver.wait(until.urlContains('habitos'), 20000);
            console.log('✓ Redirigido a formulario de hábitos');
            
            // Paso 3: Formularios/Hábitos
            await completeFormulariosForm(driver);
            await driver.wait(until.urlContains('resultados'), 15000);
            console.log('✓ Redirigido a página de resultados');
            
            // Paso 4: Página de Resultados
            await completeResultsPage(driver);
            
            // Paso 5: Verificar redirección al dashboard
            console.log('→ Esperando redirección al dashboard...');
            await driver.wait(until.urlContains('dashboard'), 15000);
            
            const finalUrl = await driver.getCurrentUrl();
            console.log(`✓✓✓ FLUJO COMPLETO EXITOSO - URL final: ${finalUrl}`);
            console.log('====================================================================================\n');
            
            const duration = Date.now() - startTime;
            captureTestResults('formularios-complete-flow', true, duration);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            captureTestResults('formularios-complete-flow', false, duration);
            await captureErrorScreenshot(driver, 'error-formularios-complete.png');
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });
});