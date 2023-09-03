/**
 * This lambda function will handle disconnect event.
 * 
 * @Author Rahul Saliya
 */
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

// rempve connection from the table
async function removeConnection(connectionId) {
    const params = {
        TableName: 'ChatConnections',
        Key: {
            connectionId: { S: connectionId },
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteItem-property
        await dynamodb.deleteItem(params).promise();
        console.log('Deleted item');
    }
    catch (error) {
        console.log('Error deleting item:', error.message);
    }
}

// lambda handler
exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const connectionId = event.requestContext.connectionId;


    await removeConnection(connectionId);

    return {
        statusCode: 200,
        body: 'Disconnected.',
    };
};