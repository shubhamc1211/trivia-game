// Import required modules
const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define an empty array to store achieved achievements
let achievedAchievements = [];

// Achievement function to check and push achieved achievements for a player
function checkAchievements(player) {
  // Games Played Achievements
  if (player.gamesPlayed >= 10) {
    achievedAchievements.push("Novice Player");
  }
  if (player.gamesPlayed >= 50) {
    achievedAchievements.push("Experienced Gamer");
  }
  if (player.gamesPlayed >= 100) {
    achievedAchievements.push("Seasoned Challenger");
  }

  // Win/Loss Ratio Achievements
  const winLossRatio = player.winLossRatio;
  if (winLossRatio >= 3) {
    achievedAchievements.push("Unstoppable Force");
  }
  if (winLossRatio >= 5) {
    achievedAchievements.push("Master Strategist");
  }
  if (winLossRatio >= 10) {
    achievedAchievements.push("Legendary Champion");
  }

  // Total Points Achievements
  if (player.totalPoints >= 1000) {
    achievedAchievements.push("Score Hunter");
  }
  if (player.totalPoints >= 5000) {
    achievedAchievements.push("Point Collector");
  }
  if (player.totalPoints >= 10000) {
    achievedAchievements.push("Point Dominator");
  }

  // Number of Wins Achievements
  if (player.wins >= 5) {
    achievedAchievements.push("Victorious Rookie");
  }
  if (player.wins >= 25) {
    achievedAchievements.push("Proven Winner");
  }
  if (player.wins >= 50) {
    achievedAchievements.push("Dominant Gladiator");
  }
  if (player.wins >= 100) {
    achievedAchievements.push("Unbeatable Titan");
  }
}

// Define the HTTP function named "getAchieve" to handle incoming requests
functions.http("getAchieve", async (req, res) => {
  // Implement CORS handling
  return await cors(req, res, async () => {
    // Set CORS headers in the response
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Clear the array before processing new achievements
    achievedAchievements = [];

    // Extract the 'id' from the request body
    let id = req.body.id;

    try {
      // Get the player data from the Firestore collection "users" based on the provided 'id'
      const snapshot = await admin
        .firestore()
        .collection("users")
        .doc(id)
        .get();

      // Extract the player's achievement data from the Firestore document
      const achivData = snapshot.data();

      // Call the achievement function with the relevant player data
      checkAchievements({
        gamesPlayed: achivData.gamesPlayed,
        winLossRatio: achivData.winLossRatio,
        totalPoints: achivData.totalPoints,
      });

      // Check if player data exists in the Firestore collection "users"
      if (achivData) {
        // Return the achieved achievements in the response as JSON
        res.status(200).json(achievedAchievements);
      } else {
        // If player data doesn't exist, create an empty achievements document in the "achievements" collection
        await admin.firestore().collection("achievements").doc(id).set({});

        // Return an empty array as JSON in the response
        res.status(200).json([]);
      }
    } catch (error) {
      // Handle errors and return an error response in case of any issues
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});
