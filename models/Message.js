const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    senderId: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },
    room: {
    type: String,
    required: true,
    default: 'general'
},
    createdAt: {
        type: Date,
        default: Date.now
    }
    
    
});

module.exports = mongoose.model('Message', messageSchema);
