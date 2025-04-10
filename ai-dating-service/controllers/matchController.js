const { findMatches } = require("../services/aiMatcher");

const getTopMatches = async (req, res) => {
  try {
    const { userId } = req.params;
    const matches = await findMatches(userId);
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error in getTopMatches:", error);
    res.status(500).json({ message: "Error fetching matches", error });
  }
};

module.exports = { getTopMatches };
