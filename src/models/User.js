const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'كلمة المرور مطلوبة']
    },
    role: {
        type: String,
        enum: ['Admin', 'Employee', 'Customer'],
        default: 'Customer'
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    banReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);