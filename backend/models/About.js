const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);