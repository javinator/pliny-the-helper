import {expect, test} from '@playwright/test';

test('Login error', async ({page}) => {
  await page.goto('/settings');

  await expect(page.locator('#devOptions')).not.toBeVisible();
  await page.locator('#main-content').locator('ion-checkbox', {hasText: 'Show developer options'}).click();
  await page.locator('#main-content').locator('ion-button', {hasText: 'Save'}).click();

  await expect(page.locator('#main-content').getByLabel('Email')).toBeEmpty();
  await expect(page.locator('#main-content').getByLabel('Password', {exact: true})).toBeEmpty();

  await page.locator('#main-content').getByLabel('Email').fill('test@test.ch');
  await page.locator('#main-content').getByLabel('Password', {exact: true}).fill('test');

  await expect(page.locator('ion-toast', {hasText: 'Email and password are not correct!'})).not.toBeInViewport();

  await page.locator('#main-content').locator('ion-button', {hasText: 'Login'}).click();

  await expect(page.locator('ion-toast', {hasText: 'Email and password are not correct!'})).toBeInViewport();
});
