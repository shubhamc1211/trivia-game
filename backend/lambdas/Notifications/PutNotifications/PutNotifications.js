const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Parse the request body JSON data
  const data = JSON.parse(event.body);
  // Alternative way to access event body:
  // const data = event;

  // Extract individual properties from the data object
  const date = data.date;
  const notification = data.notification;
  const id = data.id;
  const path = data.path;
  const isLink = data.isLink;
  const goToLocation = data.goToLocation;

  // Define parameters for scanning the DynamoDB table to check if the item already exists
  const getParams = {
    TableName: "projectNotifications",
    FilterExpression: "id = :idValue",
    ExpressionAttributeValues: {
      ":idValue": id,
    },
  };

  // Perform a scan operation on the DynamoDB table with the provided parameters
  const result = await dynamoDB.scan(getParams).promise();

  let note;
  // Check if an item with the specified id already exists in the table
  if (result.Items.length != 0) {
    // If an item exists, update the existing item with the new notification
    note = result.Items[0];
    note.isNew = true;
    note.data.unshift({
      date: date,
      notification: notification,
      path: path,
      isLink: isLink,
      goToLocation: goToLocation,
    });
  } else {
    // If an item with the specified id does not exist, create a new item with the notification
    note = {
      id: id,
      isNew: true,
      data: [
        {
          date: date,
          notification: notification,
          path: path,
          isLink: isLink,
          goToLocation: goToLocation,
        },
      ],
    };
  }

  // Log the modified note object
  console.log("Printing note", note);

  // Define parameters for putting the updated or new item into the DynamoDB table
  const params = {
    TableName: "projectNotifications",
    Item: note,
  };
  console.log("params:", params);

  console.log("Before return");

  try {
    // Put the item into the DynamoDB table
    await dynamoDB.put(params).promise();
    console.log("In return");
    // Return a successful response with status code 200 and a success message
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
      },
      body: "Successfully created item!",
    };
  } catch (err) {
    // Return an error response with status code 500 and the error details
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
      },
      error: err,
    };
  }
};
