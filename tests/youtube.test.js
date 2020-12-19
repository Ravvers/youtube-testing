const automateYoutubeFunctionality = require('../automateYoutubeFunctionality')

describe('Testing YouTube functionality', () => {
    beforeEach(() => {
        jest.setTimeout(70000)
    })

    test('Log into Youtube', () => {
        return automateYoutubeFunctionality.logInToYouTube({
            email: 'raveenautotest@gmail.com',
            password: 'testpassword123'
        }).then((params) => {
            params.webDriverParts.browser.close()
            expect(params.username).toBe('Raveen Test')
        })    
    })

    test('Check channel featured in subscriptions is subscribed to', () => {
        return automateYoutubeFunctionality.isSubscribedTo()
        .then((subscribeText) => {
            expect(subscribeText).toBe('Subscribed')
        })
    })

    test('Check that a video is in the watch later section if added to watch later', () => {
        return automateYoutubeFunctionality.isInWatchLater()
        .then((isInWatchLater) => {
            expect(isInWatchLater).toBe(true)
        })
    })

    test('Ensure that viewing a video shows in History', () => {
        return automateYoutubeFunctionality.isShownInHistory()
        .then((videoTitles) => {
            expect(videoTitles.videoTitle).toBe(videoTitles.videoTitleFromHistory)
        })
    })
})