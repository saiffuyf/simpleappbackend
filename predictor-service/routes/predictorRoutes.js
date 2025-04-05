// const express = require("express");
// const { predictCrush,createInteraction } = require("../controllers/predictorController");

// const router = express.Router();

// router.post("/crush", predictCrush);
// router.post("/interaction", createInteraction);

// module.exports = router;

const express = require("express");
const { predictCrush, createInteraction } = require("../controllers/predictorController");

const router = express.Router();

router.post("/crush", predictCrush);
router.post("/interaction", createInteraction);

module.exports = router;
