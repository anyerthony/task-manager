
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'El título es obligatorio'],
        trim: true 
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Vínculo
});

module.exports = mongoose.model('Task', TaskSchema);