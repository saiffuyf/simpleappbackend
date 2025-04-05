// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// const predictorRoutes = require("./routes/predictorRoutes");

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// app.use("/api/predictor", predictorRoutes);

// const port = process.env.PORT || 5005;
// app.listen(port, () => console.log(`Predictor service running on ${port}`));


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const predictorRoutes = require("./routes/predictorRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/predictor", predictorRoutes);

const port = process.env.PORT || 5005;
app.listen(port, () => console.log(`Predictor service running on ${port}`));
