// Import required modules
const AWS = require("aws-sdk");
const fs = require("fs");
const base64 = require("base64-js");

// Create an S3 instance
const s3 = new AWS.S3();

// Define the AWS Lambda handler function
exports.handler = async (event, context) => {
  // Log the event object received from the request
  console.log(event);

  // Parse the JSON body data from the request
  const body = JSON.parse(event.body);
  const id = body.id;

  // Define the S3 bucket name where the profile images are stored
  const bucketName = "projectuserprofileimages";

  // Construct the object key using the 'id'
  const objectKey = `${id}_profile_pic.png`;

  try {
    // Read the file content from S3 using the specified bucket and object key
    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };
    const response = await s3.getObject(params).promise();
    const fileContent = response.Body;

    // Convert the file content to base64
    const base64Content = base64.fromByteArray(fileContent);

    // Return a successful response with status code 200 and the base64 encoded image content in the body
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
      },
      body: base64Content,
    };
  } catch (err) {
    // If there is an error, return an error response with status code 500 and the error message in the body
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
      },
      body: `Error: ${err.message}`,
    };
  }
};
