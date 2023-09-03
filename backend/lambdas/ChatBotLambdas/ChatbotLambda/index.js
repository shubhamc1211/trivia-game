/**
 * This lambda function is to provide fullfillments for the Lex bot.
 * This lambda function will fetch navigation paths for the website and team scores.
 * 
 * @Author Rahul Saliya
 */
const getScore = require('./getScore');
const lexResponse = require('./lexResponse');
const getNavigation = require('./getNavigation');

/**
 * This function is to provide fullfillments for the Lex bot.
 * 
 * @param {*} event
 * 
 * @returns response
 * */
exports.handler = async (event) => {
    const intent = event.interpretations[0].intent;
    const intentName = intent.name;

    switch (true) {
        case intentName === 'Navigation_Intent':
            return getNavigation(event);
        case intentName === 'Scrore_Intent':
            return await getScore(event);
    }

    return lexResponse(
        {
            type: 'Close'
        },
        {
            confirmationState: 'None',
            name: intentName,
            state: 'Fulfilled'
        },
        [
            {
                contentType: 'PlainText',
                content: 'Sorry, I could not understand.'
            }
        ]
    );
};