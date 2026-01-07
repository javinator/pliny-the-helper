import {expect, test} from '@playwright/test';

test('App Startup', async ({page}) => {
  await page.goto('/');
  await page.waitForTimeout(250);
  await expect(page).toHaveTitle("Pliny the Helper");
  await expect(page.locator('#main-content').locator('ion-title')).toContainText("Recipes");
  await expect(page.locator('.no-recipes')).toContainText('You don\'t have a recipe yet!');

  await expect(page.getByRole('navigation').locator('ion-menu-toggle')).toHaveCount(5);

});

test('Styles Page', async ({page}) => {
  await page.goto('/styles');
  await page.waitForTimeout(250);
  await expect(page.locator('#main-content').locator('ion-title')).toContainText("Style Viewer");
  await expect(page.locator('#main-content').locator('style-card')).toHaveCount(43);

  await page.locator('#main-content').locator('style-card').first().click();
  await expect(page).toHaveURL('/styles/details');
  await expect(page.locator('#main-content').locator('ion-card-title').locator('h1')).toContainText("Lager / Pils");
  await page.locator('#main-content').locator('ion-button').click();
  await expect(page).toHaveURL('/styles');
});

test('Ingredients Page', async ({page}) => {
  await page.goto('/ingredients');
  await expect(page.locator('#main-content').locator('ion-title')).toContainText("Ingredients Viewer");
  await expect(page.locator('#main-content').locator('ion-segment-button')).toHaveCount(4);

  await page.locator('#main-content').locator('input').fill('Biscuit');
  await expect(page.locator('#main-content').locator('fermentables-card')).toHaveCount(1);

  await page.locator('#main-content').locator('ion-segment-button', {hasText: 'Hops'}).click();
  await expect(page.locator('#main-content').locator('fermentables-card')).toHaveCount(0);
  await expect(page.locator('#main-content').locator('hops-card')).toHaveCount(0);
  await page.locator('#main-content').locator('input').clear();
  await expect(page.locator('#main-content').locator('hops-card')).toHaveCount(121);

  await page.locator('#main-content').locator('ion-segment-button', {hasText: 'Yeasts'}).click();
  await expect(page.locator('#main-content').locator('hops-card')).toHaveCount(0);
  await expect(page.locator('#main-content').locator('yeasts-card')).toHaveCount(46);

  await page.locator('#main-content').locator('ion-segment-button', {hasText: 'Misc'}).click();
  await expect(page.locator('#main-content').locator('yeasts-card')).toHaveCount(0);
  await expect(page.locator('#main-content').locator('miscs-card')).toHaveCount(29);
});

test('Calculators Page', async ({page}) => {
  await page.goto('/calculators');
  await expect(page.locator('#main-content').locator('ion-title')).toContainText("Calculators");
  await expect(page.locator('#main-content').locator('ion-segment-button')).toHaveCount(4);

  await expect(page.locator('#abv-calculation')).toContainText("0.00 %");
  await expect(page.locator('#attenuation-calculation')).toContainText("0.0 %");

  await page.locator('#main-content').getByLabel('Original Gravity').fill('1.055');
  await page.locator('#main-content').getByLabel('Final Gravity').fill('1.011');
  await expect(page.locator('#abv-calculation')).toContainText("5.85 %");
  await expect(page.locator('#attenuation-calculation')).toContainText("80.0 %");

  await page.locator('#main-content').locator('ion-segment-button', {hasText: 'Hydrometer Adjustment'}).click();
  await page.locator('#main-content').getByLabel('Original Gravity').fill('1.060');
  await page.locator('#main-content').getByLabel('Wort Temperature').fill('35');
  await expect(page.locator('#adjustment-calculation')).toContainText("Gravity at 20°C: 1.064");

  await page.locator('#main-content').locator('ion-segment-button', {hasText: 'Refractometer Adjustment'}).click();
  await page.locator('#main-content').getByLabel('Measured OG').fill('1.064');
  await page.locator('#main-content').getByLabel('Measured FG').fill('1.032');
  await expect(page.locator('#og-calculation')).toContainText("1.064");
  await expect(page.locator('#fg-calculation')).toContainText("1.015");
  await expect(page.locator('#ref-abv-calculation')).toContainText("6.68 %");
  await expect(page.locator('#ref-attenuation-calculation')).toContainText("77.2 %");

  await page.locator('#main-content').locator('ion-segment-button', {hasText: 'Conversions'}).click();
  await page.locator('#main-content').getByLabel('SG').fill('1.050');
  await expect(page.locator('#main-content').getByLabel('Brix')).toHaveValue("12.4");
  await page.locator('#main-content').getByLabel('Brix').fill('19.5');
  await expect(page.locator('#main-content').getByLabel('SG')).toHaveValue("1.081");

  await page.locator('#main-content').getByLabel('SRM').fill('32');
  await expect(page.locator('#main-content').getByLabel('EBC')).toHaveValue("63");
  await expect(page.locator('#main-content').getByLabel('Lovibond')).toHaveValue("23.7");
  await page.locator('#main-content').getByLabel('EBC').fill('30');
  await expect(page.locator('#main-content').getByLabel('SRM')).toHaveValue("15.2");
  await expect(page.locator('#main-content').getByLabel('Lovibond')).toHaveValue("11.3");
  await page.locator('#main-content').getByLabel('Lovibond').fill('2');
  await expect(page.locator('#main-content').getByLabel('SRM')).toHaveValue("2.7");
  await expect(page.locator('#main-content').getByLabel('EBC')).toHaveValue("5.3");

  await page.locator('#main-content').getByLabel('Celsius').fill('-17.8');
  await expect(page.locator('#main-content').getByLabel('Fahrenheit')).toHaveValue("0");
  await page.locator('#main-content').getByLabel('Fahrenheit').fill('100');
  await expect(page.locator('#main-content').getByLabel('Celsius')).toHaveValue("37.8");

  await page.locator('#main-content').getByLabel('Kilos').fill('2');
  await expect(page.locator('#main-content').getByLabel('Pounds')).toHaveValue("4.41");
  await page.locator('#main-content').getByLabel('Pounds').fill('12');
  await expect(page.locator('#main-content').getByLabel('Kilos')).toHaveValue("5.44");
  await page.locator('#main-content').getByLabel('Grams').fill('750');
  await expect(page.locator('#main-content').getByLabel('Ounces')).toHaveValue("26.46");
  await page.locator('#main-content').getByLabel('Ounces').fill('50');
  await expect(page.locator('#main-content').getByLabel('Grams')).toHaveValue("1’417.476");

  await page.locator('#main-content').getByLabel('Liters').fill('2');
  await expect(page.locator('#main-content').getByLabel('Gallons')).toHaveValue("0.53");
  await page.locator('#main-content').getByLabel('Gallons').fill('5');
  await expect(page.locator('#main-content').getByLabel('Liters')).toHaveValue("18.93");

  await page.locator('#main-content').getByLabel('% ABV').fill('8');
  await expect(page.locator('#main-content').getByLabel('% ABW')).toHaveValue("6.4");
  await page.locator('#main-content').getByLabel('% ABW').fill('9');
  await expect(page.locator('#main-content').getByLabel('% ABV')).toHaveValue("11.25");
});

test('Settings Page', async ({page}) => {
  await page.goto('/settings');
  await expect(page.locator('#main-content').locator('ion-title')).toContainText("Settings");

  await expect(page.getByRole('navigation').locator('ion-menu-toggle', {hasText: 'Water Profiles'})).not.toBeVisible();
  await expect(page.locator('#devOptions')).not.toBeVisible();

  await page.locator('#main-content').locator('ion-checkbox', {hasText: 'Use Water Chemistry'}).click();
  await page.locator('#main-content').locator('ion-checkbox', {hasText: 'Show developer options'}).click();
  await page.locator('#main-content').locator('ion-button', {hasText: 'Save'}).click();

  await expect(page.getByRole('navigation').locator('ion-menu-toggle', {hasText: 'Water Profiles'})).toBeVisible();
  await expect(page.locator('#devOptions')).toBeVisible();
});
