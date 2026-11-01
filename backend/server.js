const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const { seedCoursesIfNeeded } = require('./config/seedCourses');
const courseRoutes = require('./routes/courseRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow frontend development server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);

// Health check / Root endpoint
app.get('/', (req, res) => {
  const isDbConnected = require('mongoose').connection.readyState === 1;
  res.json({
    project: 'College Course Registration System API',
    status: 'Running',
    database: isDbConnected ? 'Connected to MongoDB Atlas' : 'Connecting to MongoDB Atlas...',
    version: '1.0.0',
    endpoints: {
      courses: '/api/courses',
      registrations: '/api/registrations',
      dashboardStats: '/api/registrations/dashboard/stats'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

// Start Express server immediately
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  College Course Registration Backend Server`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

// Function to connect and retry if necessary
const tryConnectDB = async () => {
  try {
    await connectDB();
    await seedCoursesIfNeeded();
  } catch (err) {
    console.log('[Database] Retrying connection in 10 seconds...');
    setTimeout(tryConnectDB, 10000);
  }
};

tryConnectDB();

module.exports = { app, server };
