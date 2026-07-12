# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Alur Login >> login berhasil harus mengarahkan ke halaman utama dan tampilkan Logout
- Location: e2e\login.spec.js:32:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:5173/"
Received: "http://localhost:5173/login"
Timeout:  15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    33 × unexpected value "http://localhost:5173/login"

```

```yaml
- navigation:
  - link "💬 Forum Diskusi":
    - /url: /
  - link "Threads":
    - /url: /
  - link "Leaderboard":
    - /url: /leaderboard
  - link "Login":
    - /url: /login
  - link "Register":
    - /url: /register
- main:
  - heading "Login" [level=2]
  - paragraph: email or password is wrong
  - text: Email
  - textbox "Email": test@test.com
  - text: Password
  - textbox "Password": testtest
  - button "Login"
  - paragraph:
    - text: Belum punya akun?
    - link "Daftar":
      - /url: /register
```

# Test source

```ts
  1  | /**
  2  |  * End-to-End tests untuk alur Login
  3  |  *
  4  |  * Skenario:
  5  |  * - Halaman login menampilkan form email dan password
  6  |  * - Login dengan kredensial salah menampilkan pesan error
  7  |  * - Login dengan kredensial benar mengarahkan ke halaman utama (/)
  8  |  *   dan menampilkan tombol Logout di navbar
  9  |  */
  10 | 
  11 | import { test, expect } from '@playwright/test';
  12 | 
  13 | test.describe('Alur Login', () => {
  14 |   test.beforeEach(async ({ page }) => {
  15 |     await page.goto('/login');
  16 |   });
  17 | 
  18 |   test('halaman login harus menampilkan form email dan password', async ({ page }) => {
  19 |     await expect(page.locator('h2')).toHaveText('Login');
  20 |     await expect(page.locator('#login-email')).toBeVisible();
  21 |     await expect(page.locator('#login-password')).toBeVisible();
  22 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('login dengan kredensial salah harus menampilkan pesan error', async ({ page }) => {
  26 |     await page.fill('#login-email', 'salah@email.com');
  27 |     await page.fill('#login-password', 'passwordsalah');
  28 |     await page.click('button[type="submit"]');
  29 |     await expect(page.locator('.error-msg')).toBeVisible({ timeout: 10000 });
  30 |   });
  31 | 
  32 |   test('login berhasil harus mengarahkan ke halaman utama dan tampilkan Logout', async ({ page }) => {
  33 |     // Gunakan akun yang sudah terdaftar di Dicoding Forum API
  34 |     await page.fill('#login-email', 'test@test.com');
  35 |     await page.fill('#login-password', 'testtest');
  36 |     await page.click('button[type="submit"]');
> 37 |     await expect(page).toHaveURL('/', { timeout: 15000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  38 |     await expect(page.locator('button', { hasText: 'Logout' })).toBeVisible();
  39 |   });
  40 | });
  41 | 
```