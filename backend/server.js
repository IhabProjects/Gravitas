require('dotenv').config();
const express = require('express');
const cors = require('cors');
const planetWeightRoutes = require('./routes/planetWeightRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/planet-weight', planetWeightRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('GRAVITAS API is running.');
});

// Future API endpoints can be mounted here, e.g.:
// const weightRoutes = require('./routes/weight');
// app.use('/api/weight', weightRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
