const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Parse the request body JSON data
  const data = JSON.parse(event.body);

  // Extract the 'id' from the data
  const id = data.id;

  // Log the received body data
  console.log("Got body:", data);

  // Define parameters for scanning the DynamoDB table
  const params = {
    TableName: "projectNotifications",
    FilterExpression: "id = :idValue",
    ExpressionAttributeValues: {
      ":idValue": id,
    },
  };

  console.log();
  try {
    // Perform a scan operation on the DynamoDB table with the provided parameters
    const result = await dynamoDB.scan(params).promise();

    let note;
    let isNew;

    // Check if the 'result.Items' array is not empty
    if (!result.Items == []) {
      // If not empty, get the first item from the result (assuming 'id' is unique)
      note = result.Items[0];
      // Save the current 'isNew' value for later use
      isNew = note.isNew;
      // Update the 'isNew' attribute to false
      note.isNew = false;
    }

    // Define parameters for updating the DynamoDB table
    const updateParams = {
      TableName: "projectNotifications",
      Item: note,
    };

    // Update the item in the DynamoDB table with the modified 'note' object
    await dynamoDB.put(updateParams).promise();

    // Restore the original 'isNew' value if the 'result.Items' array was not empty
    if (!result.Items == []) {
      note = result.Items[0];
      note.isNew = isNew;
    }

    // Return a successful response with status code 200 and the scanned items as JSON
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    // Return an error response with status code 500 and the error message
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Credentials": true,
      },
      body: "Error retrieving data: " + error.message,
    };
  }
};
