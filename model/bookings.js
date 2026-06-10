const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    /* user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }, */
    home: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home', 
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;