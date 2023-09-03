// Import required modules
const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define the HTTP function named "getUser" to handle incoming requests
functions.http("getUser", async (req, res) => {
  // Implement CORS handling
  return await cors(req, res, async () => {
    // Set CORS headers in the response
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Log the request body
    console.log("here.....:", req.body);

    // Extract the 'id' from the request body
    let id = req.body.id;
    // Initialize the 'email' variable
    let email = "";

    try {
      // Get the user data from the Firestore collection "users" based on the provided 'id'
      const snapshot = await admin
        .firestore()
        .collection("users")
        .doc(id)
        .get();

      // Extract the user data object from the Firestore document
      let userData = snapshot.data();

      // Calculate the 'winLossRatio' for the user based on 'wins' and 'gamesPlayed' properties
      userData.winLossRatio =
        userData.wins / (userData.gamesPlayed - userData.wins);

      // Check if user data exists in the Firestore collection "users"
      if (userData) {
        // Return the user data as JSON in the response
        res.status(200).json(userData);
      } else {
        // If user data doesn't exist, extract the 'email' from the request body
        email = req.body.email;

        // Initialize properties for a new user
        const wins = 0;
        const winLossRatio = 0;
        const gamesPlayed = 0;
        const contact = "";
        const name = "";
        const totalPoints = 0;

        // Create a new document for the user in the Firestore collection "users"
        await admin.firestore().collection("users").doc(id).set({
          id,
          email,
          wins,
          winLossRatio,
          gamesPlayed,
          contact,
          name,
          totalPoints,
        });

        // Return a message in the response indicating that a new user has been created
        res.status(200).json({ message: "User not found, new user created" });
      }
    } catch (error) {
      // Handle errors and return an error response in case of any issues
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});
