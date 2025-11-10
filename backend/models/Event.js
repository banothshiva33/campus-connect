const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add event description']
    },
    date: {
        type: Date,
        required: [true, 'Please add event date']
    },
    category: {
        type: String,
        required: [true, 'Please add event category'],
        enum: ['academic', 'sports', 'cultural', 'workshop', 'seminar', 'other']
    },
    department: {
        type: String,
        required: [true, 'Please add department']
    },
    venue: {
        type: String,
        required: [true, 'Please add venue']
    },
    maxParticipants: {
        type: Number,
        default: 0
    },
    googleFormLink: {
        type: String,
        required: false
    },
    image: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);