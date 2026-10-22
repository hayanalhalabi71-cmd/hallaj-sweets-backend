const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'يجب تحديد الزبون صاحب الطلب']
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            size: { type: String, required: true }, 
            priceAtOrder: { type: Number, required: true }, 
            quantity: { type: Number, required: true, min: 1 } 
        }
    ],
    totalAmount: {
        type: Number,
        required: [true, 'إجمالي قيمة الطلب مطلوب']
    },
    shippingAddress: {
        type: String,
        required: [true, 'عنوان التوصيل مطلوب']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Preparing', 'Out for Delivery', 'Completed', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);