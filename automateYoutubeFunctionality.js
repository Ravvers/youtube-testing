const puppeteer = require('puppeteer')

//Log into Youtube; Test Case 1
const logInToYouTube = async (userCredentials) => {
    const webDriverParts = await startBrowser()
    const page = webDriverParts.page
    await goToSignIn(page)
    await fillEmail(page, userCredentials)
    await fillPassword(page, userCredentials)
    const userLogin = await confirmLogIn(page)
    return {webDriverParts, userLogin}
}

//Functions
async function startBrowser() {
    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1366, height: 768});
    await page.goto('https://youtube.com')
    return { page, browser }
}


async function goToSignIn(page) {
    await page.evaluate(() => {
        document.querySelector('a [aria-label="Sign in"]').closest('a').click()
    })
    await page.waitForNavigation()
}

async function fillEmail(page, userCredentials) {
    await page.evaluate((userCredentials) => {
        document.querySelector('#identifierId').value = userCredentials.email
        document.querySelector('#identifierNext button').click()
    }, userCredentials)
    await page.waitForNavigation()
}
  
async function fillPassword(page, userCredentials) {
    await page.evaluate((userCredentials) => {
        document.querySelector('#password input').value = userCredentials.password
        document.querySelector('#passwordNext button').click()
    }, userCredentials)
    await page.waitForNavigation()
}

async function confirmLogIn(page) {
    await page.evaluate(() => {
        document.querySelector('#avatar-btn').click()
    })
    await page.waitForTimeout(3000)
    const userEmail = await page.evaluate(() => {
        return document.querySelector('#account-name').textContent
    })
    return userEmail
}

//Export
module.exports = {
    logInToYouTube
}