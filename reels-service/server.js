// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const reelRoutes = require('./routes/reelRoutes');

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// app.use('/api/reels', reelRoutes);

// const PORT = process.env.PORT || 5003;
// app.listen(PORT, () => console.log(`Reel Service running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const reelRoutes = require('./routes/reelRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/reels', reelRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Reel Service running on port ${PORT}`));
