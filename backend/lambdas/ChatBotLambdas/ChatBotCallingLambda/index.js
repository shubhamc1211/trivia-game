/**
 * This lambda function will be called by the frontend to get the response from the chatbot.
 * 
 * @Author Rahul Saliya
 */
const AWS = require('aws-sdk');
const lexClient = new AWS.LexRuntimeV2({ region: 'us-east-1' });

// lambda handler
exports.handler = async (event) => {
    const body = event.body ? JSON.parse(event.body) : event;
    const message = body.message;
    const userId = body.userId;

    if (!message || !userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request' }),
        };
    }

    try {
        const lexParams = {
            botAliasId: 'TSTALIASID',
            botId: '2X5JWVJ7EP',
            localeId: 'en_US',
            sessionId: userId,
            text: message,
        };

        // Calling lex to get the response
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexRuntimeV2.html
        const lexResponse = await lexClient.recognizeText(lexParams).promise();
        const botMessage = lexResponse.messages[0].content;

        return {
            statusCode: 200,
            body: botMessage,
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};