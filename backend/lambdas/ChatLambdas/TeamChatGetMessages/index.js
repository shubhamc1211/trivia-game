/**
 * This lambda function will handle message sent by the user.
 * 
 * @Author Rahul Saliya
 */
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

// lambda handler
exports.handler = async (event) => {
    const gameId = event.queryStringParameters.gameId;
    const teamId = event.queryStringParameters.teamId;

    const params = {
        TableName: 'ChatMessages',
        Key: {
            teamId: { S: teamId },
            gameId: { S: gameId },
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
        const data = await dynamodb.getItem(params).promise();
        console.log('Got item');
        const messages = data.Item.messages.L.map((item) => item.S);
        return {
            statusCode: 200,
            body: JSON.stringify(messages),
        };
    }
    catch (error) {
        console.log('Error getting item:', error.message);
    }
    return {
        statusCode: 500,
        body: 'Error getting messages',
    };

};