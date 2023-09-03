// Import required modules
const AWS = require("aws-sdk");
const fs = require("fs");

// Create an S3 instance
const s3 = new AWS.S3();

// Define the AWS Lambda handler function
exports.handler = async (event, context) => {
  // Log the event body and context for debugging
  console.log("event body", event);
  console.log("context body", context);

  // Initialize a variable to hold the parsed body
  let body;

  // Check if the event body is Base64 encoded
  if (event.isBase64Encoded) {
    // Step 1: Extract the Base64 encoded body from the event
    const base64Body = event.body;

    // Step 2: Decode the Base64 encoded string using Buffer.from()
    const decodedBuffer = Buffer.from(base64Body, "base64");

    // Step 3: Optionally, convert the Buffer to a regular string (if needed)
    body = decodedBuffer.toString("utf-8");
  } else {
    // If not Base64 encoded, use the raw event body
    body = event.body;
  }

  // Parse the JSON body
  body = JSON.parse(body);
  console.log("Printing body", body);

  try {
    // Extract relevant data from the body
    const id = body.id;
    const base64Image = body.base64Image;

    // Extract the Base64 data portion from the image data URL
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // Create a buffer from the Base64 data
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Generate the file name using the 'id' and set the S3 bucket and path
    const fileName = `${id}_profile_pic.png`;
    const bucketName = "projectuserprofileimages";
    const s3Path = `${fileName}`;

    // Configure the S3 upload parameters
    const s3Params = {
      Bucket: bucketName,
      Key: s3Path,
      Body: imageBuffer,
      ContentType: "image/png",
    };

    // Upload the image to S3
    await s3.upload(s3Params).promise();

    // Generate the S3 URL for the uploaded image
    const s3Url = `https://${bucketName}.s3.amazonaws.com/${s3Path}`;

    // Return a successful response with the S3 URL in the body
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ imageUrl: s3Url }),
    };
  } catch (error) {
    // Handle errors and return an error response in case of any issues
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Failed to save image in S3" }),
    };
  }
};
