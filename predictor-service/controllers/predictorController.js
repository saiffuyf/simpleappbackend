const Interaction = require("../models/Interaction");
const axios = require("axios");

exports.predictCrush = async (req, res) => {
  const { userId, targetUserId } = req.body;

  try {
    const interaction = await Interaction.findOne({ userId, targetUserId });

    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" });
    }

    const response = await axios.post(`${process.env.AI_SERVICE_URL}`, {
      likes: interaction.likes,
      comments: interaction.comments,
      dms: interaction.dms,
      responseTime: interaction.responseTime,
    });

    res.json({ crush: response.data.crush });
  } catch (err) {
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
};

exports.createInteraction = async (req, res) => {
    const { userId, targetUserId, likes, comments, dms, responseTime } = req.body;
  
    try {
      const newInteraction = new Interaction({
        userId,
        targetUserId,
        likes,
        comments,
        dms,
        responseTime
      });
  
      await newInteraction.save();
      res.status(201).json({ message: "Interaction created", interaction: newInteraction });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating interaction", error: err.message });
    }
  };
  