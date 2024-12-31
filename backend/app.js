const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const chatRoute = require('./routes/chat');
const cors = require('cors');
const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error) {
    console.error('Error loading .env file:', result.error);
}

console.log('Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    apiKeyExists: !!process.env.HF_API_KEY,
});

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});


// Routes
app.use('/api/chat', chatRoute);

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
