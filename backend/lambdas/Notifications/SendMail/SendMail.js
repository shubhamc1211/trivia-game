const AWS = require("aws-sdk");
const os = require("os");

exports.handler = async (event, context) => {
  // Log function start
  console.log("Function Started.....");

  // Create an AWS SNS instance
  const sns = new AWS.SNS();

  // Parse the request body JSON data
  const data = JSON.parse(event.body);
  // Alternative way to access event body:
  // const data = event.body

  // Log the input data received from the request
  console.log("input data:", data);

  // Extract data properties from the parsed object
  const topicArn = "arn:aws:sns:us-east-1:507714350943:projectMail";
  const message = data.message;
  const subject = data.subject;
  const isSubscribe = data.isSubscribe;
  const email = data.email;

  // Log whether the user wants to subscribe or not
  console.log("sub?:", isSubscribe);

  // Check if the user wants to subscribe to the SNS topic
  if (isSubscribe) {
    console.log("in sub?:", isSubscribe);
    // Subscribe the email address to the SNS topic with filter policy
    await sns
      .subscribe({
        TopicArn: topicArn,
        Protocol: "email",
        Endpoint: email,
        Attributes: {
          FilterPolicy: '{"email": ["' + email + '"]}',
        },
      })
      .promise();

    console.log(email + " Subscribed to " + topicArn);
  } else {
    console.log("not in sub?:", isSubscribe);
    // Prepare parameters for sending a regular SNS message
    let params = {
      Message: message,
      Subject: subject,
      TopicArn: topicArn,
      MessageAttributes: {
        email: {
          DataType: "String",
          StringValue: email,
        },
      },
    };
    console.log("Params: ", params);

    // Publish the message to the SNS topic
    var result = await sns.publish(params).promise();
    console.log("result: ", result);
  }

  // Create a response to send back
  console.log("Creating Response");

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Credentials": true,
    },
    body: "Mail sent",
  };

  console.log("returnng", response);
  // Return the response
  return response;
};
