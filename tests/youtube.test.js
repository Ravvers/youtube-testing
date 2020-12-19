const automateYoutubeFunctionality = require('../automateYoutubeFunctionality')

describe("Testing YouTube functionality", () => {
    beforeEach(() => {
        jest.setTimeout(50000)
    })

    test("Log into Youtube", () => {
        return automateYoutubeFunctionality.logInToYouTube({
            email: 'raveenautotest@gmail.com',
            password: 'testpassword123'
        }).then((params) => {
            params.webDriverParts.browser.close()
            expect(params.userLogin).toBe('Raveen Test')
        })    
    })

    test.skip("Check channel featured in subscriptions is subscribed to", () => {

    })

    test.skip("Check that a video is in the watch later section if added to watch later", () => {

    })

    test.skip("Ensure that viewing a video shows in History", () => {

    })
})