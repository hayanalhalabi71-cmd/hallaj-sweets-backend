const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم المنتج مطلوب'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'وصف المنتج مطلوب']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'يجب تحديد القسم التابع له المنتج']
    },
    
    priceOptions: [
        {
            size: { type: String, required: true }, 
            price: { type: Number, required: true } 
        }
    ],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);