/**
 * This lambda function will handle message sent by the user.
 * 
 * @Author Rahul Saliya
 */
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const apiGateway = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: 'https://ghwumpsmn4.execute-api.us-east-1.amazonaws.com/production',
});

// create table if not exist
async function createTableIfNotExist() {
    const params = {
        TableName: 'ChatMessages',
        KeySchema: [
            { AttributeName: 'teamId', KeyType: 'HASH' },
            { AttributeName: 'gameId', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
            { AttributeName: 'teamId', AttributeType: 'S' },
            { AttributeName: 'gameId', AttributeType: 'S' },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
        await dynamodb.createTable(params).promise();
        console.log('Created table');
    }
    catch (error) {
        if (error.code === 'ResourceInUseException') {
            console.log('Table already exists');
        }
        else {
            console.log('Error creating table:', error.message);
        }
    }
}

// add message to the table
async function addMessage(teamId, gameId, messageString) {
    const params = {
        TableName: 'ChatMessages',
        Item: {
            teamId: { S: teamId },
            gameId: { S: gameId },
            messages: {
                L: [{
                    S: messageString,
                }]
            },
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
        await dynamodb.putItem(params).promise();
        console.log('Inserted item');
    }
    catch (error) {
        console.log('Error inserting item:', error.message);
    }
}

// update message in the table
async function updateMessage(teamId, gameId, messageString) {
    const params = {
        TableName: 'ChatMessages',
        Key: {
            teamId: { S: teamId },
            gameId: { S: gameId },
        },
        UpdateExpression: 'SET messages = list_append(messages, :newMessage)',
        ExpressionAttributeValues: {
            ':newMessage': {
                L: [{
                    S: messageString,
                }]
            },
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateItem-property
        await dynamodb.updateItem(params).promise();
        console.log('Updated item');
        return true;
    }
    catch (error) {
        console.log('Error updating item:', error.message);
    }

    return false;
}


// get connections from the table
async function getConnections(teamId, gameId) {
    const params = {
        TableName: 'ChatConnections',
        IndexName: 'gameId-teamId-index',
        KeyConditionExpression: 'gameId = :gameId and teamId = :teamId',
        ExpressionAttributeValues: {
            ':gameId': { S: gameId },
            ':teamId': { S: teamId },
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#query-property
        const data = await dynamodb.query(params).promise();
        console.log('Got item');
        const connections = data.Items.map((item) => item.connectionId.S);
        return connections;
    }
    catch (error) {
        console.log('Error getting item:', error.message);
    }
    return [];
}

// send message to other users
async function sendToOtherUsers(teamId, gameId, messageString, connectionId) {
    const connections = await getConnections(teamId, gameId);

    const promises = connections.map((connection) => {
        if (connection !== connectionId) {
            return sendMessageToConnection(connection, messageString);
        }
        return Promise.resolve();
    });

    await Promise.all(promises);

    console.log('Sent message to other users');
}

// send message to connection by connectionId
async function sendMessageToConnection(connectionId, messageString) {
    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayManagementApi.html#postToConnection-property
        await apiGateway.postToConnection({
            ConnectionId: connectionId,
            Data: messageString,
        }).promise();
        console.log('Sent message to connection');
    }
    catch (error) {
        console.log('Error sending message to connection:', error.message);
    }
}

// lambda handler
exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const body = JSON.parse(event.body);
    const message = body.message;
    const teamId = body.teamId;
    const gameId = body.gameId;
    const userName = body.userName;
    const userId = body.userId;

    const messageBody = {
        message: message,
        userId: userId,
        userName: userName,
        timestamp: new Date().toISOString(),
    }

    const messageString = JSON.stringify(messageBody);

    await createTableIfNotExist();

    const isAppended = await updateMessage(teamId, gameId, messageString);
    if (!isAppended) {
        await addMessage(teamId, gameId, messageString);
    }

    await sendToOtherUsers(teamId, gameId, messageString, connectionId);

    return {
        statusCode: 200,
        body: 'Message sent.',
    }
};