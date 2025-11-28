// models/Ride.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const RideSchema = new Schema({
    rider: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Links to the User model
        required: true,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Null until a driver accepts
    },
    // Geospatial data for pickup location
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        }
    },
    // Geospatial data for destination location
    destinationLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        }
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'in-progress', 'completed', 'cancelled'],
        default: 'requested',
    },
    fare: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// CRITICAL: Index for efficient searching for nearby requests
RideSchema.index({ pickupLocation: '2dsphere' });

module.exports = mongoose.model('Ride', RideSchema);