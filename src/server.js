/**
 * University Research Opportunity Portal - Main Server
 * FAST Peshawar Campus - Assignment #01 (Fall-2026, BS CS 5B)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { getDb } = require('./config/db');
const opportunityRoutes = require('./routes/opportunities');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for demonstration & debugging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'University Research Opportunity Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount Research Opportunities API Routes
app.use('/api/opportunities', opportunityRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Fallback to index.html for any frontend SPA navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Centralized error handling
app.use(errorHandler);

// Start server function
async function startServer() {
  try {
    // Warm up database connection
    await getDb();

    const server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`  University Research Opportunity Portal`);
      console.log(`  FAST Peshawar Campus - BS CS 5B (Fall-2026)`);
      console.log(`  Server running at: http://localhost:${PORT}`);
      console.log(`  API Endpoints at:  http://localhost:${PORT}/api/opportunities`);
      console.log(`  Frontend Portal:   http://localhost:${PORT}`);
      console.log('====================================================');
    });

    return server;
  } catch (error) {
    console.error('Fatal server startup error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
