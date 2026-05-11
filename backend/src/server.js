const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes hookup
app.use('/api/services', require('./routes/services'));
// app.use('/api/sos', require('./routes/sos'));

// Basic route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'RoadSOS API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
