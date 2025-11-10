const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['event_reminder', 'registration_confirmation', 'event_update', 'system'],
        default: 'system'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedEvent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);