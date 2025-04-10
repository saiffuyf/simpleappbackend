const express = require("express");
const { getTopMatches } = require("../controllers/matchController");

const router = express.Router();

router.get("/matches/:userId", getTopMatches); // ✅ Only this

module.exports = router;
