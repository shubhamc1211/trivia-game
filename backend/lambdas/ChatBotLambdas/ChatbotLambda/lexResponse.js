/**
 * This function is to generate response for the Lex bot.
 * 
 * @param {*} dialogAction 
 * @param {*} intent 
 * @param {*} messages 
 * @returns lexResponse
 */
module.exports = function lexResponse(dialogAction, intent, messages) {

    if (!dialogAction || !intent || !messages) {
        throw new Error('Invalid lexResponse parameters');
    }

    const response = {
        sessionState: {
            dialogAction: dialogAction,
            intent: intent
        },
        messages: messages
    };

    return response;
}