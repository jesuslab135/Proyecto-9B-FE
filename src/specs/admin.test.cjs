const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { loginAsAdmin } = require('./helpers.cjs');

describe('Admin CRUD (Emociones / Habitos / Motivos)', function() {
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

    it('should create, edit and delete Emociones, Habitos and Motivos via admin UI', async function() {
        this.timeout(180000);

        const base = process.env.TEST_BASE_URL || 'http://localhost:5173';

        try {
            // Login as admin (credentials via env or defaults)
            await loginAsAdmin(driver);

            const ts = Date.now();

            // Helper to perform CRUD for a resource
            async function testResource(resourcePath, resourceLabel, createData, editPatch) {
                // Go to admin resource list
                await driver.get(`${base}/admin/${resourcePath}`);
                // Wait for header and Crear button
                await driver.wait(until.elementLocated(By.xpath(`//div[.//h2[contains(.,'${resourceLabel}')]]//a[contains(.,'Crear')]`)), 10000);

                // Click Crear
                const crearBtn = await driver.findElement(By.xpath(`//div[.//h2[contains(.,'${resourceLabel}')]]//a[contains(.,'Crear')]`));
                await crearBtn.click();

                // Fill form fields based on createData mapping
                for (const field of Object.keys(createData)) {
                    const sel = `input[name="${field}"]`;
                    await driver.wait(until.elementLocated(By.css(sel)), 10000);
                    await driver.findElement(By.css(sel)).clear().catch(() => {});
                    await driver.findElement(By.css(sel)).sendKeys(String(createData[field]));
                }

                // Submit
                await driver.findElement(By.css('button[type="submit"]')).click();

                // Wait back to list
                await driver.wait(until.urlContains(`/admin/${resourcePath}`), 15000);

                // Verify created item exists (look for a div that contains the created name)
                const createdName = createData[Object.keys(createData)[0]]; // assume first field is display
                const itemXpath = `//div[contains(@class,'p-3')][.//div[contains(.,'${createdName}')]]`;
                await driver.wait(until.elementLocated(By.xpath(itemXpath)), 10000);

                // Edit the item
                const itemEl = await driver.findElement(By.xpath(itemXpath));
                const editBtn = await itemEl.findElement(By.xpath(`.//a[contains(.,'Editar')]`));
                await editBtn.click();

                // Wait for form and apply editPatch
                for (const field of Object.keys(editPatch)) {
                    const sel = `input[name="${field}"]`;
                    await driver.wait(until.elementLocated(By.css(sel)), 10000);
                    const input = await driver.findElement(By.css(sel));
                    await input.clear().catch(() => {});
                    await input.sendKeys(String(editPatch[field]));
                }

                // Submit edits
                await driver.findElement(By.css('button[type="submit"]')).click();
                await driver.wait(until.urlContains(`/admin/${resourcePath}`), 15000);

                // Verify edited value present
                const editedName = editPatch[Object.keys(editPatch)[0]];
                const editedXpath = `//div[contains(@class,'p-3')][.//div[contains(.,'${editedName}')]]`;
                await driver.wait(until.elementLocated(By.xpath(editedXpath)), 10000);

                // Delete the item
                const editedItem = await driver.findElement(By.xpath(editedXpath));
                const deleteBtn = await editedItem.findElement(By.xpath(`.//button[contains(.,'Eliminar')]`));
                await deleteBtn.click();

                // Wait until item disappears
                await driver.wait(async () => {
                    const els = await driver.findElements(By.xpath(editedXpath));
                    return els.length === 0;
                }, 10000);
            }

            // Test Emociones
            await testResource('emociones', 'Emociones', { nombre: `Emocion test ${ts}`, intensidad: '5' }, { nombre: `Emocion test ${ts} - edited` });

            // Test Habitos
            await testResource('habitos', 'Hábitos', { titulo: `Habito test ${ts}`, frecuencia: 'diario' }, { titulo: `Habito test ${ts} - edited` });

            // Test Motivos
            await testResource('motivos', 'Motivos', { descripcion: `Motivo test ${ts}` }, { descripcion: `Motivo test ${ts} - edited` });

            console.log('✓ Admin CRUD smoke tests passed for emociones, habitos, motivos');

        } catch (error) {
            try {
                const screenshot = await driver.takeScreenshot();
                require('fs').writeFileSync('error-admin-screenshot.png', screenshot, 'base64');
                console.error('❌ Error capturado. Screenshot guardado como error-admin-screenshot.png');
            } catch (e) {
                console.error('No se pudo tomar screenshot:', e.message);
            }
            console.error('Mensaje de error:', error.message);
            throw error;
        }
    });
});
