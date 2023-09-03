// Import required modules
const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define the HTTP function named "setUsers" to handle incoming requests
functions.http("setUsers", async (req, res) => {
  // Implement CORS handling
  return await cors(req, res, async () => {
    // Set CORS headers in the response
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Log the request body
    console.log("printing body:", req.body);
    console.log("printing id: from req", req.body.id);

    // Extract the user object from the request body
    let user = req.body;
    console.log("printing id:", user.id);

    try {
      // Get a reference to the Firestore instance
      const firestore = admin.firestore();

      // Update the user document in the Firestore collection "users" using the 'id' as the document ID
      await firestore
        .collection("users")
        .doc(user.id)
        .set(user, { merge: true });

      // Log a message indicating the successful update
      console.log(`User ${user.id} updated in Firestore`);

      // Return a success message in the response
      res.status(200).json({ message: `User ${user.id} updated.` });
    } catch (error) {
      // Handle errors and return an error response in case of any issues
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});
