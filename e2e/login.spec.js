/**
 * End-to-End tests untuk alur Login
 *
 * Skenario:
 * - Halaman login menampilkan form email dan password
 * - Login dengan kredensial salah menampilkan pesan error
 * - Login dengan kredensial benar mengarahkan ke halaman utama (/)
 *   dan menampilkan tombol Logout di navbar
 */

import { test, expect } from '@playwright/test';

test.describe('Alur Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('halaman login harus menampilkan form email dan password', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Login');
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('login dengan kredensial salah harus menampilkan pesan error', async ({ page }) => {
    await page.fill('#login-email', 'salah@email.com');
    await page.fill('#login-password', 'passwordsalah');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-msg')).toBeVisible({ timeout: 10000 });
  });

  test('login berhasil harus mengarahkan ke halaman utama dan tampilkan Logout', async ({ page }) => {
    await page.fill('#login-email', process.env.TEST_EMAIL || 'Naufalpalal@gmail.com');
    await page.fill('#login-password', process.env.TEST_PASSWORD || '123456789');
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 15000 });
    await expect(page.locator('button', { hasText: 'Logout' })).toBeVisible();
  });
});
