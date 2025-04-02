const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
// app.use(cors());
app.use(cors({ 
  origin: 'https://simpleappbackend-1.onrender.com', 
  methods: ['GET', 'POST'],
  credentials: true
}));

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
