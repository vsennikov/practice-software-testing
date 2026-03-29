import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

test.describe('Login Page - based on LoginTestCases.md', () => {
	let loginPage: LoginPage
	const validEmail = 'customer@practicesoftwaretesting.com'
	const validPassword = 'welcome01'

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page)
		await loginPage.open()
	})

	// TC-LOG-001: Successful login with valid credentials
	test('[TC-483] TC-LOG-001 - successful login with valid credentials', async ({ page }) => {
		await loginPage.login(validEmail, validPassword)

		await expect(page).toHaveURL(/account/)
		await expect(page.locator('h1')).toContainText('My account')
	})

	// TC-LOG-002: Login with email case insensitivity
	test('[TC-484] TC-LOG-002 - login with email case insensitivity', async ({ page }) => {
		const uppercaseEmail = validEmail.toUpperCase()

		await loginPage.login(uppercaseEmail, validPassword)

		await expect(page).toHaveURL(/account/)
		await expect(page.locator('h1')).toContainText('My account')
	})

	// TC-LOG-003: Login with invalid password
	test('[TC-485] TC-LOG-003 - login with invalid password shows error', async () => {
		await loginPage.login(validEmail, 'WrongPass123!')

		await expect(loginPage.loginError).toBeVisible()
		await expect(loginPage.loginError).toHaveText('Invalid email or password')
	})

	// TC-LOG-004: Login with non-registered email
	test('[TC-486] TC-LOG-004 - login with non-registered email shows error', async () => {
		await loginPage.login('random.user.999@test.com', 'AnyPassword123!')

		await expect(loginPage.loginError).toBeVisible()
		await expect(loginPage.loginError).toHaveText('Invalid email or password')
	})

	// TC-LOG-005: Login with empty fields
	test('[TC-487] TC-LOG-005 - login with empty fields shows validation errors', async () => {
		await loginPage.loginButton.click()

		await expect(loginPage.loginError).toBeVisible()

		await expect(loginPage.loginError).toHaveText('Invalid email or password')
	})

	// TC-LOG-006: Login with invalid email format
	test('[TC-488] TC-LOG-006 - login with invalid email format shows validation error', async () => {
		await loginPage.emailInput.fill('user.com')
		await loginPage.passwordInput.fill('AnyPassword123!')
		await loginPage.loginButton.click()

		await expect(loginPage.loginError).toBeVisible()
		await expect(loginPage.loginError).toHaveText('Invalid email or password')
	})

	// TC-LOG-007: Toggle password visibility ("Eye" icon)
	test('[TC-489] TC-LOG-007 - toggle password visibility with eye icon', async () => {
		await loginPage.passwordInput.fill('SecretPass123')

		await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
		await loginPage.clickShowPassword()
		await expect(loginPage.passwordInput).toHaveAttribute('type', 'text')

		await loginPage.clickShowPassword()
		await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
	})

	// TC-LOG-008: Navigation to "Forgot Password" page
	test('[TC-490] TC-LOG-008 - navigate to Forgot Password page', async ({ page }) => {
		await loginPage.clickForgotPassword()

		await expect(page).toHaveURL(/auth\/forgot-password/)
		await expect(page.locator('h3')).toContainText('Forgot Password')
	})

	// TC-LOG-009: Navigation to "Registration" page
	test('[TC-491] TC-LOG-009 - navigate to Registration page', async ({ page }) => {
		await loginPage.clickRegister()

		await expect(page).toHaveURL(/auth\/register/)
		await expect(page.locator('h3')).toContainText('Customer registration')
	})
})
