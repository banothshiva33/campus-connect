const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['registered', 'attended', 'cancelled'],
        default: 'registered'
    },
    studentDetails: {
        studentId: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        year: {
            type: String,
            default: ''
        },
        section: {
            type: String,
            default: ''
        },
        additionalInfo: {
            type: String,
            default: ''
        }
    }
});

// Prevent duplicate registrations
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);