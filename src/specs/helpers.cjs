// Helper functions para reutilizar en los tests

const { By, until } = require('selenium-webdriver');

/**
 * Inicia sesión como administrador usando credenciales provistas o variables de entorno.
 */
async function loginAsAdmin(driver, creds = {}) {
    const email = creds.email || process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = creds.password || process.env.ADMIN_PASS || 'adminpass';

    const base = process.env.TEST_BASE_URL || 'http://localhost:5173';
    await driver.get(`${base}/login`);

    // Esperar inputs de login
    await driver.wait(until.elementLocated(By.css('.form-box.login input[name="email"]')), 10000);
    await driver.findElement(By.css('.form-box.login input[name="email"]')).sendKeys(email);
    await driver.findElement(By.css('.form-box.login input[name="password"]')).sendKeys(password);

    // Enviar formulario
    await driver.findElement(By.css('.form-box.login button[type="submit"]')).click();

    // Pequeña espera para que el login avance (se usan waits explícitos en los tests después)
    await driver.sleep(1000);

    return { email, password };
}

/**
 * Genera un email único basado en timestamp
 */
function generateUniqueEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test${timestamp}${random}@gmail.com`;
}

/**
 * Genera un nombre aleatorio
 */
function generateRandomName() {
    const nombres = ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Pedro', 'Laura', 'Miguel', 'Elena'];
    const apellidos = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores'];
    
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    
    return `${nombre} ${apellido}`;
}

/**
 * Genera un teléfono aleatorio
 */
function generateRandomPhone() {
    const areaCode = '663';
    const number = Math.floor(1000000 + Math.random() * 9000000); // 7 dígitos
    return `${areaCode}${number}`;
}

/**
 * Genera una contraseña aleatoria
 */
function generateRandomPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = 'test';
    for (let i = 0; i < 6; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

/**
 * Genera edad aleatoria entre 18 y 65 años
 */
function generateRandomAge() {
    return (Math.floor(Math.random() * (65 - 18 + 1)) + 18).toString();
}

/**
 * Genera peso aleatorio entre 50 y 120 kg
 */
function generateRandomWeight() {
    return (Math.random() * (120 - 50) + 50).toFixed(1);
}

/**
 * Genera altura aleatoria entre 150 y 200 cm
 */
function generateRandomHeight() {
    return (Math.floor(Math.random() * (200 - 150 + 1)) + 150).toString();
}

/**
 * Genera nivel de compromiso aleatorio entre 5 y 10
 */
function generateRandomCommitmentLevel() {
    return (Math.floor(Math.random() * (10 - 5 + 1)) + 5).toString();
}

/**
 * Selecciona una opción aleatoria de un array
 */
function getRandomOption(options) {
    return options[Math.floor(Math.random() * options.length)];
}

/**
 * Completa el formulario de registro con datos únicos
 */
async function completeRegistrationForm(driver, customData = {}) {
    const testData = {
        nombre: customData.nombre || generateRandomName(),
        email: customData.email || generateUniqueEmail(),
        telefono: customData.telefono || generateRandomPhone(),
        password: customData.password || generateRandomPassword()
    };

    console.log('→ Completando formulario de registro...');
    await driver.sleep(2000);
    
    // Hacer clic en el botón Register
    await driver.findElement(By.css('.register-btn')).click();
    console.log('  ✓ Botón Register clickeado');
    await driver.sleep(1000);
    
    // Llenar formulario
    await driver.findElement(By.css('.form-box.register input[name="nombre"]')).sendKeys(testData.nombre);
    await driver.findElement(By.css('.form-box.register input[name="email"]')).sendKeys(testData.email);
    await driver.findElement(By.css('.form-box.register input[name="telefono"]')).sendKeys(testData.telefono);
    await driver.findElement(By.css('.form-box.register input[name="password"]')).sendKeys(testData.password);
    console.log(`  ✓ Datos generados:`);
    console.log(`    - Nombre: ${testData.nombre}`);
    console.log(`    - Email: ${testData.email}`);
    console.log(`    - Teléfono: ${testData.telefono}`);
    console.log(`    - Password: ${testData.password}`);
    
    // Enviar formulario
    await driver.findElement(By.css('.form-box.register button[type="submit"]')).click();
    console.log('  ✓ Formulario enviado');
    
    return testData;
}

/**
 * Completa el formulario de datos físicos con datos aleatorios
 */
async function completePhysicalDataForm(driver, customData = {}) {
    const physicalData = {
        edad: customData.edad || generateRandomAge(),
        peso: customData.peso || generateRandomWeight(),
        altura: customData.altura || generateRandomHeight()
    };

    console.log('→ Completando formulario de datos físicos...');
    
    // Esperar a que el formulario esté visible
    await driver.wait(until.elementLocated(By.id('edad')), 10000);
    await driver.sleep(1000);
    
    await driver.findElement(By.id('edad')).sendKeys(physicalData.edad);
    await driver.findElement(By.id('peso')).sendKeys(physicalData.peso);
    await driver.findElement(By.id('altura')).sendKeys(physicalData.altura);
    console.log(`  ✓ Datos físicos generados:`);
    console.log(`    - Edad: ${physicalData.edad} años`);
    console.log(`    - Peso: ${physicalData.peso} kg`);
    console.log(`    - Altura: ${physicalData.altura} cm`);
    
    // Enviar formulario
    await driver.findElement(By.css('button[type="submit"].btn-primary')).click();
    console.log('  ✓ Formulario enviado');
    
    return physicalData;
}

/**
 * Completa el formulario de hábitos/formularios con datos variados
 */
/**
 * Completa el formulario de hábitos/formularios con datos variados
 */
async function completeFormulariosForm(driver, customData = {}) {
    console.log('→ Completando formulario de hábitos...');
    
    let currentUrl = await driver.getCurrentUrl();
    console.log(`  → URL actual: ${currentUrl}`);
    
    // Esperar a que la página cargue
    await driver.sleep(3000);
    
    // Detectar qué tipo de formulario es
    console.log('  → Detectando tipo de formulario...');
    
    const hasCheckboxes = await driver.executeScript(`
        return document.querySelectorAll('input[type="checkbox"]').length > 0;
    `);
    
    const hasSelects = await driver.executeScript(`
        return document.getElementById('habito_principal') !== null;
    `);
    
    console.log(`    - Tiene checkboxes: ${hasCheckboxes}`);
    console.log(`    - Tiene selects: ${hasSelects}`);
    
    // FORMULARIO 1: Checkboxes (Hábitos/Emociones/Motivos/Soluciones)
    if (hasCheckboxes) {
        console.log('  → Formulario tipo: Checkboxes');
        
        // Esperar a que cargue
        await driver.wait(async () => {
            return await driver.executeScript(`
                return document.readyState === 'complete' && 
                       document.querySelectorAll('input[type="checkbox"]').length > 0;
            `);
        }, 15000);
        
        // 1. Seleccionar hábito
        console.log('  → Seleccionando hábito...');
        const habitos = ['Fumar cigarrillos', 'Vapear', 'Leer', 'Beber alcohol', 'Correr'];
        const habitoSel = getRandomOption(habitos);
        
        try {
            const habitoCb = await driver.findElement(By.xpath(`//label[contains(text(), '${habitoSel}')]/preceding-sibling::input | //label[contains(text(), '${habitoSel}')]/../input`));
            await habitoCb.click();
            console.log(`  ✓ Hábito: ${habitoSel}`);
        } catch (e) {
            const firstCb = await driver.findElement(By.css('input[type="checkbox"]'));
            await firstCb.click();
            console.log(`  ✓ Primer checkbox seleccionado`);
        }
        
        await driver.sleep(500);
        
        // 2. Seleccionar emoción
        console.log('  → Seleccionando emoción...');
        const emociones = ['Ansiedad', 'Aburrimiento', 'Estrés', 'Tristeza'];
        const emocionSel = getRandomOption(emociones);
        
        try {
            const emocionCb = await driver.findElement(By.xpath(`//label[contains(text(), '${emocionSel}')]/preceding-sibling::input | //label[contains(text(), '${emocionSel}')]/../input`));
            await emocionCb.click();
            console.log(`  ✓ Emoción: ${emocionSel}`);
        } catch (e) {
            console.log(`  ⚠ No se pudo seleccionar emoción específica`);
        }
        
        await driver.sleep(500);
        
        // 3. Seleccionar motivo
        console.log('  → Seleccionando motivo...');
        const motivos = ['Social', 'Habitual', 'Celebración', 'Trabajo', 'Problemas personales'];
        const motivoSel = getRandomOption(motivos);
        
        try {
            const motivoCb = await driver.findElement(By.xpath(`//label[contains(text(), '${motivoSel}')]/preceding-sibling::input | //label[contains(text(), '${motivoSel}')]/../input`));
            await motivoCb.click();
            console.log(`  ✓ Motivo: ${motivoSel}`);
        } catch (e) {
            console.log(`  ⚠ No se pudo seleccionar motivo "${motivoSel}", intentando alternativa...`);
            // Buscar cualquier checkbox en la sección de motivos
            try {
                const motivoAlt = await driver.findElement(By.xpath(`//label[contains(text(), 'Social')]/preceding-sibling::input | //label[contains(text(), 'Social')]/../input`));
                await motivoAlt.click();
                console.log(`  ✓ Motivo alternativo seleccionado`);
            } catch (e2) {
                console.log(`  ⚠ Error seleccionando motivo: ${e2.message}`);
            }
        }
        
        await driver.sleep(500);
        
        // 4. Seleccionar solución
        console.log('  → Seleccionando solución...');
        const soluciones = ['Respiración', 'Correr', 'Beber agua', 'Música', 'Caminar', 'Leer'];
        const solucionSel = getRandomOption(soluciones);
        
        try {
            const solucionCb = await driver.findElement(By.xpath(`//label[contains(text(), '${solucionSel}')]/preceding-sibling::input | //label[contains(text(), '${solucionSel}')]/../input`));
            await solucionCb.click();
            console.log(`  ✓ Solución: ${solucionSel}`);
        } catch (e) {
            console.log(`  ⚠ Buscando cualquier checkbox disponible para solución...`);
            // Buscar cualquier checkbox no marcado
            const allCbs = await driver.findElements(By.css('input[type="checkbox"]'));
            let found = false;
            for (let cb of allCbs) {
                const isChecked = await cb.isSelected();
                if (!isChecked) {
                    await cb.click();
                    console.log(`  ✓ Solución seleccionada`);
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log(`  ⚠ No se pudo encontrar checkbox disponible`);
            }
        }
        
        await driver.sleep(1000);
        
        // 5. Verificar que todos los campos requeridos estén completos
        console.log('  → Verificando campos requeridos...');
        const hasErrors = await driver.executeScript(`
            const errors = document.querySelectorAll('.error-message, [style*="color: red"], [style*="color:red"]');
            return Array.from(errors).filter(e => e.textContent.includes('requerido')).length > 0;
        `);
        
        if (hasErrors) {
            console.log('  ⚠ Aún hay campos requeridos, tomando screenshot...');
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('missing-required-fields.png', screenshot, 'base64');
            console.log('  → Screenshot: missing-required-fields.png');
        } else {
            console.log('  ✓ Todos los campos requeridos completados');
        }
        
        // 6. Hacer clic en Finalizar
        console.log('  → Buscando botón Finalizar...');
        const finalizarBtn = await driver.findElement(By.xpath(`//button[contains(text(), 'Finalizar')]`));
        await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', finalizarBtn);
        await driver.sleep(500);
        
        const isEnabled = await finalizarBtn.isEnabled();
        console.log(`    - Botón habilitado: ${isEnabled}`);
        
        await finalizarBtn.click();
        console.log('  ✓ Clic en "Finalizar"');
        
        await driver.sleep(3000);
        
        // Verificar si hay otro formulario
        currentUrl = await driver.getCurrentUrl();
        console.log(`    - URL después: ${currentUrl}`);
        
        // Si sigue en habitos, puede que haya otro formulario
        if (currentUrl.includes('habitos')) {
            console.log('  → Verificando si hay segundo formulario...');
            await driver.sleep(2000);
            
            const hasSelectsNow = await driver.executeScript(`
                return document.getElementById('habito_principal') !== null;
            `);
            
            if (hasSelectsNow) {
                console.log('  → Encontrado formulario con selects, continuando...');
                return await completeFormulariosFormSelects(driver);
            }
        }
    }
    
    // FORMULARIO 2: Selects (Cuestionario de Perfil)
    else if (hasSelects) {
        return await completeFormulariosFormSelects(driver);
    }
    
    console.log('  ✓ Formulario(s) completado(s)');
    return {};
}

/**
 * Completa la página de resultados haciendo clic en Siguiente
 */
async function completeResultsPage(driver) {
    console.log('→ Completando página de resultados...');
    
    // Esperar a que cargue
    await driver.wait(until.elementLocated(By.css('.results-container')), 10000);
    console.log('  ✓ Página de resultados cargada');
    
    await driver.sleep(1500);
    
    // Buscar botón Siguiente
    const siguienteBtn = await driver.findElement(By.css('.btn-next, button.btn-next'));
    
    // Hacer scroll al botón
    await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', siguienteBtn);
    await driver.sleep(500);
    
    // Hacer clic
    await siguienteBtn.click();
    console.log('  ✓ Clic en "Siguiente" exitoso');
    
    return {};
}

/**
 * Completa el formulario con selects (Cuestionario de Perfil)
 */
async function completeFormulariosFormSelects(driver) {
    console.log('  → Completando formulario de selects...');
    
    await driver.wait(until.elementLocated(By.id('habito_principal')), 15000);
    await driver.sleep(1000);
    
    // Hábito principal
    await driver.findElement(By.id('habito_principal')).sendKeys('fumar');
    console.log('  ✓ Hábito principal');
    
    // Frecuencia
    await driver.findElement(By.id('frecuencia_uso')).sendKeys('diario');
    console.log('  ✓ Frecuencia');
    
    // Tiempo de uso
    await driver.findElement(By.id('tiempo_uso')).sendKeys('1_3_anos');
    console.log('  ✓ Tiempo de uso');
    
    // Motivación
    await driver.findElement(By.id('motivacion_cambio')).sendKeys('Quiero mejorar mi salud');
    console.log('  ✓ Motivación');
    
    // Nivel de compromiso (slider)
    const slider = await driver.findElement(By.id('nivel_compromiso'));
    await driver.executeScript(`
        const sl = arguments[0];
        sl.value = '8';
        sl.dispatchEvent(new Event('change', { bubbles: true }));
        sl.dispatchEvent(new Event('input', { bubbles: true }));
    `, slider);
    console.log('  ✓ Nivel de compromiso: 8');
    
    // Campos opcionales
    await driver.findElement(By.id('apoyo_social')).sendKeys('si_algo');
    await driver.findElement(By.id('intentos_previos')).sendKeys('si_una');
    await driver.findElement(By.id('objetivo_principal')).sendKeys('Dejar de fumar en 6 meses');
    console.log('  ✓ Campos opcionales');
    
    // Submit
    await driver.findElement(By.css('button[type="submit"].btn-primary')).click();
    console.log('  ✓ Formulario enviado');
    
    return {};
}


/**
 * Captura un screenshot en caso de error
 */
async function captureErrorScreenshot(driver, filename) {
    try {
        const screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync(filename, screenshot, 'base64');
        console.error(`❌ Screenshot guardado como ${filename}`);
    } catch (err) {
        console.error('No se pudo capturar el screenshot:', err.message);
    }
}

module.exports = {
    completeRegistrationForm,
    completePhysicalDataForm,
    completeFormulariosForm,
    captureErrorScreenshot,
    completeFormulariosFormSelects,
    completeResultsPage,
    // Exportar funciones auxiliares por si se necesitan
    generateUniqueEmail,
    generateRandomName,
    generateRandomPhone,
    generateRandomPassword,
    generateRandomAge,
    generateRandomWeight,
    generateRandomHeight,
    generateRandomCommitmentLevel
    ,
    loginAsAdmin
};