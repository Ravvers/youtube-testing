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
const isSubscribedTo = async () => {
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

//Check that a video is in the watch later section if added to watch later; Test Case 3
const isInWatchLater = async () => {
    const params = logInToYouTube({
        email: 'raveenautotest@gmail.com',
        password: 'testpassword123'
    })
    const page = (await params).webDriverParts.page
    await page.goto('https://youtube.com')
    await goToTrending(page)
    const videoTitle = await addToWatchLater(page)
    await goToWatchLater(page)
    const inWatchLater = await searchWatchLater(page, videoTitle)
    const close = (await params).webDriverParts.browser.close()
    return inWatchLater
}

//Ensure that viewing a video shows in History; Test Case 4
const isShownInHistory = async () => {
    const params = logInToYouTube({
        email: 'raveenautotest@gmail.com',
        password: 'testpassword123'
    })
    const page = (await params).webDriverParts.page
    await page.goto('https://youtube.com')
    await goToTrending(page)
    const videoTitle = await openFirstVideo(page)
    await goToHome(page)
    await goToHistory(page)
    const videoTitleFromHistory = await searchHistory(page)
    const close = (await params).webDriverParts.browser.close()
    return { videoTitle, videoTitleFromHistory }
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

async function goToTrending(page) {
    await page.evaluate(() => {
        document.querySelector("[title='Trending']").click()
    })
    await page.waitForTimeout(5000)   
}

async function addToWatchLater(page) {
    await page.evaluate(() => {
        document.getElementById('grid-container').querySelector('#menu').querySelector('#button').getElementsByTagName('yt-icon')[0].click()
    })
    await page.waitForTimeout(5000)
    const videoTitle = await page.evaluate(async () => {
        document.getElementsByTagName('ytd-menu-popup-renderer')[0].getElementsByTagName('ytd-menu-service-item-renderer')[1].click()
        return document.getElementById('grid-container').querySelector('#video-title').getAttribute('title')
    })
    return videoTitle
}

async function goToWatchLater(page) {
    await page.evaluate(() => {
        document.querySelector('[title="Watch later"]').click()
    })
    await page.waitForTimeout(5000)  
}

async function searchWatchLater(page, videoTitle) {
    const inWatchLater = await page.evaluate((videoTitle) => {
        if (document.querySelector('[title="' + videoTitle + '"]') !== null) {
            return true
        }
        else {
            return false
        }
    }, videoTitle)
    return inWatchLater
}

async function openFirstVideo(page) {
    const videoTitle = await page.evaluate(() => {
        const videoTitle = document.getElementById('grid-container').querySelector('#video-title').getAttribute('title')
        document.getElementById('grid-container').querySelector('#video-title').click()
        return videoTitle
    })
    await page.waitForTimeout(15000)
    await page.evaluate(() => {
        if(document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0]) {
        document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0].click()
        }
    })
    await page.waitForTimeout(10000)
    return videoTitle
}

async function goToHome(page) {
    await page.evaluate(() => {
        document.querySelector('[title="YouTube Home"]').click()
    })
    page.waitForNavigation()
}

async function goToHistory(page) {
    await page.evaluate(() => {
        document.querySelector('[title="History"]').click()
    })
    await page.waitForTimeout(5000)   
}

async function searchHistory(page) {
    const videoTitle = await page.evaluate(() => {
        return document.querySelector('[page-subtype="history"]').querySelector('#video-title').getAttribute('title')
    })
    return videoTitle
}

//Export
module.exports = {
    logInToYouTube,
    isSubscribedTo,
    isInWatchLater,
    isShownInHistory
}