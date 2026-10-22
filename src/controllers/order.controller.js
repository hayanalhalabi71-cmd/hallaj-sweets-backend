const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'الطلب يجب أن يحتوي على منتج واحد على الأقل' });
        }

        let orderItems = [];
        let totalAmount = 0;

        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product || !product.isAvailable) {
                return res.status(400).json({ message: `المنتج غير موجود أو غير متوفر حالياً` });
            }

            const priceOption = product.priceOptions.find(opt => opt.size === item.size);
            if (!priceOption) {
                return res.status(400).json({ message: `الحجم المختار غير متوفر للمنتج: ${product.name}` });
            }

            const priceAtOrder = priceOption.price;
            totalAmount += priceAtOrder * item.quantity;

            orderItems.push({
                product: product._id,
                size: item.size,
                priceAtOrder,
                quantity: item.quantity
            });
        }

        const order = await Order.create({
            customer: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            status: 'Pending'
        });

        res.status(201).json({
            message: 'تم إرسال الطلب بنجاح وهو بانتظار مراجعة الموظف',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).populate('items.product', 'name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'phone')
            .populate('items.product', 'name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Approved', 'Preparing', 'Out for Delivery', 'Completed', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'حالة الطلب غير صالحة' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'الطلب غير موجود' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: 'تم تحديث حالة الطلب بنجاح',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const completedOrdersCount = await Order.countDocuments({ status: 'Completed' });

        const completedOrders = await Order.find({ status: 'Completed' });
        const totalSales = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        const User = require('../models/User');
        const Category = require('../models/Category');
        const Product = require('../models/Product');

        const totalCustomers = await User.countDocuments({ role: 'Customer' });
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();

        res.status(200).json({
            totalOrders,
            pendingOrders,
            completedOrdersCount,
            totalSales,
            totalCustomers,
            totalProducts,
            totalCategories
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getAdminStats
};