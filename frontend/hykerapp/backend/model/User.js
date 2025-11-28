// models/User.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Email must be unique
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['rider', 'driver'], // Restrict roles to these two values
        default: 'rider',
    },
    // The GeoJSON structure for storing location
    location: {
        type: {
            type: String, // Must be 'Point' for 2dsphere index
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // Array of [longitude, latitude]
            required: true,
            default: [0, 0] // Default to a neutral location
        }
    },
    isAvailable: { // Important for drivers
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// CRITICAL: Create a 2dsphere index on the location field
// This allows MongoDB to efficiently perform geospatial queries (like finding drivers near a point).
UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);