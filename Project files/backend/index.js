const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectionOfDb = require('./config/connect.js');

// Import route files
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

// Configure environment variables
dotenv.config();

// Initialize the express application
const app = express();

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Enable the express application to parse JSON formatted request bodies
app.use(express.json());

// Serve static files (like uploaded images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Database Connection ---
connectionOfDb();

// --- API Routes ---
// This prefixes all your routes (e.g., /api/user/register)
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);

// Define a port number from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// Simple root endpoint for health checks
app.get('/', (req, res) => {
  res.send('<h1>Rentify Backend API is running.</h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});