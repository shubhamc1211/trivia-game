/**
 * This file is to get path for asked page
 * 
 * @Author Rahul Saliya
 */
const lexResponse = require('./lexResponse');

// list of words to match with the page name
const pathWords = [
    {
        path: 'about',
        regex: /about|about us|aboutus|about page/i,
    },
    {
        path: 'contact',
        regex: /contact|contact us|contactus|contact page/i,
    },
    {
        path: 'home',
        regex: /home|home page|dashboard|dashboard page/i,
    },
    {
        path: 'login',
        regex: /login|login page|signin|signin page/i,
    },
    {
        path: 'register',
        regex: /register|register page|signup|signup page/i,
    },
    {
        path: '/',
        regex: /root|root page|rootpage|root page|landing|landing page/i,
    }
];

/**
 * This function is to prepare url for the page
 * @param {*} url
 * @returns url
 * */
function prepareUrl(url) {
    return `<a href="${url}">${url}</a>`;
}

/**
 * This function is to get navigation path for the page
 * @param {*} event
 * @returns response
 * */
module.exports = function getNavigation(event) {
    const intent = event.interpretations[0].intent;
    const intentName = intent.name;
    const slots = intent.slots;

    const pageName = slots.PageName;

    console.log(slots);

    const dialogAction = {};

    if (!pageName) {
        dialogAction.type = 'ElicitSlot';
        dialogAction.slotToElicit = 'PageName';
        dialogAction.intentName = intentName;
        dialogAction.slots = slots;
    }
    else {
        dialogAction.type = 'Close';
    }

    const intentResponse = {
        name: intentName
    };

    if (!pageName) {
        intentResponse.confirmationState = 'None';
        intentResponse.state = 'InProgress';
    }
    else {
        intentResponse.confirmationState = 'Confirmed';
        intentResponse.state = 'Fulfilled';
    }

    const messages = [];

    if (!pageName) {
        messages.push({
            contentType: 'PlainText',
            content: 'Please provide the name of the page.'
        });
    } else {
        const pageNameValue = pageName?.value?.interpretedValue?.toLowerCase() ?? "not found";

        var path;
        for (var i = 0; i < pathWords.length; i++) {
            if (pathWords[i].regex.test(pageNameValue)) {
                path = pathWords[i].path;
                break;
            }
        }

        if (!path) {
            messages.push({
                contentType: 'PlainText',
                content: `Sorry, I could not find the page ${pageName?.value?.originalValue}.`
            });
        } else if (path === '/') {
            messages.push({
                contentType: 'PlainText',
                content: `Please click on the app icon in the top left corner to go to the home page.`
            });
        } else {
            messages.push({
                contentType: 'PlainText',
                content: `Here is the link to the page: ${prepareUrl("/" + path)}`
            });
        }
    }

    return lexResponse(dialogAction, intentResponse, messages);
}