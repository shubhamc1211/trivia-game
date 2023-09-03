const BASE_URL = "http://localhost:6001";

const APIs = {
  API_CHAT: "wss://ghwumpsmn4.execute-api.us-east-1.amazonaws.com/production",
  API_CHAT_CONNECTION:
    "https://ghwumpsmn4.execute-api.us-east-1.amazonaws.com/production/@connections",
  API_GET_MESSAGES:
    "https://p6wrwfvxp5.execute-api.us-east-1.amazonaws.com/chatMessages",
  API_CONFIRM: `${BASE_URL}/confirm`,
  API_ALL_GAMES:
    "https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/game-details",
  API_GAME_BY_ID:
    "https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/get-game-by-id",
  API_STORE_DATA:
    "https://v8jfdq6hbk.execute-api.us-east-1.amazonaws.com/dev/UserAuthenticationStoreAnswers",
  API_SUBSCRIBE_SNS:
    "https://zua4niuc24.execute-api.us-east-1.amazonaws.com/default/subscribeToSNS",
  API_REGISTER: `${BASE_URL}/register`,
  API_QUESTIONNAIRE: `${BASE_URL}/questions`,
  API_LOGIN: `${BASE_URL}/login`,
  API_LOGOUT: `${BASE_URL}/logout`,
  API_LEX: "https://p6wrwfvxp5.execute-api.us-east-1.amazonaws.com/lex",
  API_VALIDATE_ANSWER:
    "https://v8jfdq6hbk.execute-api.us-east-1.amazonaws.com/dev/verifyquestions",
  API_LEADERBOARD: `${BASE_URL}/leaderboard`,
  API_GET_USER: `https://us-central1-serverless-csci-5410.cloudfunctions.net/getUser`,
  API_GET_TEAM_AFF: `https://us-central1-serverless-csci-5410.cloudfunctions.net/getTeamAffiliations`,
  API_GET_ACHIEVEMENTS: `https://us-central1-serverless-csci-5410.cloudfunctions.net/getAchievement`,
  API_UPDATE_USER: `https://us-central1-serverless-csci-5410.cloudfunctions.net/updateUser`,
  API_GET_USER_PROFILE_IMAGE: `https://xpg25qzl8k.execute-api.us-east-1.amazonaws.com/default/getImageFromS3`,
  API_GET_NOTIFICATION: `https://dc9cjedd0a.execute-api.us-east-1.amazonaws.com/default/getNotifications`,
  API_GET_ALL_USERS: `https://us-central1-serverless-csci-5410.cloudfunctions.net/getAllUsers`,
  API_GET_USER_TEAMS:
    "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/userteam",
  API_JOIN_GAME:
    "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/jointhegame",
  API_JOIN_GAME:
    "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/jointhegame",
  API_PUT_NOTIFICATION:
    "https://rd84gpa071.execute-api.us-east-1.amazonaws.com/default/putNotification",
  API_PUT_USER_PROFILE_IMAGE: `https://zjeffhu0ki.execute-api.us-east-1.amazonaws.com/default/uploadToS3`,
  API_GET_FILTERED_GAMES: "https://p6wrwfvxp5.execute-api.us-east-1.amazonaws.com/filter-games",
};

export default APIs;
export { BASE_URL };
