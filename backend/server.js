// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Configuration
const corsOptions = {
  origin: NODE_ENV === 'production'
    ? [/\.vercel\.app$/, /\.herokuapp\.com$/, /localhost/] // Allow Vercel and other deployment platforms
    : 'http://localhost:5173', // Vite default port in development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));

// Ensure JSON parsing middleware is before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const planetWeightRoutes = require('./routes/planetWeightRoutes');

// Mount routes
app.use('/api/planet-weight', planetWeightRoutes);

app.get('/', (req, res) => {
  res.send('GRAVITAS API is running.');
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`));
