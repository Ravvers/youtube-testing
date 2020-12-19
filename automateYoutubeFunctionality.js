const puppeteer = require('puppeteer')
//Test main Functions
//Log into Youtube; Test Case 1
const logInToYouTube = async (userCredentials) => {
    const webDriverParts = await startBrowser()
    const page = webDriverParts.page
    await goToSignIn(page)
    await fillEmail(page, userCredentials)
    await fillPassword(page, userCredentials)
    const username = await confirmLogIn(page)
    return {webDriverParts, username}
}

//Check channel featured in subscriptions is subscribed to; Test Case 2
const subscribedTo = async () => {
    const params = logInToYouTube({
        email: 'raveenautotest@gmail.com',
        password: 'testpassword123'
    })
    const page = (await params).webDriverParts.page
    await page.goto('https://youtube.com')
    await goToSubscriptions(page)
    await goToChannel(page)
    const subscribeText = await getSubscribeText(page)
    const close = (await params).webDriverParts.browser.close()
    return subscribeText
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

async function goToSubscriptions(page) {
    await page.evaluate(() => {
        document.querySelector("[title='Subscriptions']").click()
    })
    await page.waitForTimeout(5000)
}

async function goToChannel(page) {
    await page.evaluate(() => {
        document.getElementsByTagName('ytd-grid-renderer')[0].querySelector('#metadata').getElementsByTagName('a')[0].click()
    })
    await page.waitForTimeout(5000)
}

async function getSubscribeText(page) {
    const subscribeText = await page.evaluate(() => {
        return document.querySelector('#inner-header-container').getElementsByTagName('paper-button')[0].getElementsByClassName('ytd-subscribe-button-renderer')[0].textContent
    })
    return subscribeText
}

//Export
module.exports = {
    logInToYouTube,
    subscribedTo
}