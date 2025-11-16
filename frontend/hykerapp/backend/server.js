// server.js

// Load environment variables (.env)
require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

// Import Routes
const userRoutes = require('./routes/userRoutes');

// --- Middleware ---
app.use(cors());             // Allow frontend requests
app.use(express.json());     // Parse incoming JSON bodies

// --- API Routes ---
app.use('/api/users', userRoutes);

// --- MongoDB Connection ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`\n🎉 MongoDB Connected Successfully!`);
        console.log(`- Database: ${conn.connection.name}`);
        console.log(`- Host: ${conn.connection.host}\n`);
    } catch (error) {
        console.error(`\n❌ MongoDB Connection Failed!`);
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// --- Start Server ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send('Backend Server is Running and Connected to MongoDB!');
    });

    app.listen(PORT, () => {
        console.log(`🚀 Express Server listening on port ${PORT}`);
    });
});