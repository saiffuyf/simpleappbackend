const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware to parse JSON requests

app.use(express.json());

app.use(cors())

// ***app.use(cors({
//   origin: ['https://texus.onrender.com'], // Add your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));


const allowedOrigins = [
  'http://localhost:4200',  // For local development
  'https://simpleapp-i551.onrender.com' // Your frontend on Render
];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// Connect to MongoDB
connectDB();
// app.use('/uploads', express.static('uploads'));

// Use routes
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
