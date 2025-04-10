const axios = require("axios");
const User = require("../models/Userdate");
const USER_SERVICE_BASE = "http://localhost:5000/api/users";

const getCompatibilityScore = (userA, userB) => {
  let score = 0;
  if (userA.username[0].toLowerCase() === userB.username[0].toLowerCase()) score += 10;
  if (userA.email.split("@")[1] === userB.email.split("@")[1]) score += 5;
  return score;
};

const findMatches = async (userId) => {
    try {
      const response = await axios.post(`${USER_SERVICE_BASE}/getUsers`);
      
      const userMap = response.data;
      const allUsers = Object.entries(userMap).map(([id, data]) => ({ _id: id, ...data }));
  
      const currentUser = allUsers.find(user => user._id === userId);
      if (!currentUser) throw new Error("Current user's profile data not found");
  
      const otherUsers = allUsers.filter(user => user._id !== userId);
  
      const matches = otherUsers.map(user => ({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture || null,
        },
        score: getCompatibilityScore(currentUser, user)
      }));
  
      return matches.sort((a, b) => b.score - a.score).slice(0, 5);
    } catch (err) {
      console.error("Error in findMatches:", err.message);
      throw err;
    }
  };

module.exports = { findMatches };
