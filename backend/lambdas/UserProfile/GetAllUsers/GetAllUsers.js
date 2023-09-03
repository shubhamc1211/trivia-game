// Import required modules
const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define the HTTP function named "getUsers" to handle incoming requests
functions.http("getUsers", async (req, res) => {
  // Implement CORS handling
  return await cors(req, res, async () => {
    // Set CORS headers in the response
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Log the request body
    console.log("here.....:", req.body);

    try {
      // Fetch all documents from the Firestore collection "users"
      const snapshot = await admin.firestore().collection("users").get();

      // Initialize an empty array to store the fetched data
      const data = [];

      // Iterate through the documents and extract the data, including the document ID
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      // Return the data as JSON in the response
      res.status(200).json(data);
    } catch (error) {
      // Handle errors and return an error response in case of any issues
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});
