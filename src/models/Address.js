const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'يجب تحديد الزبون صاحب العنوان']
    },
    addressText: {
        type: String,
        required: [true, 'عنوان التوصيل النصي مطلوب'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);