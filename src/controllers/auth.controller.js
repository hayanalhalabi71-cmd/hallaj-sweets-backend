const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashService');
const { generateToken } = require('../utils/jwtService');

const registerCustomer = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'رقم الهاتف مستخدم مسبقاً' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            phone,
            password: hashedPassword,
            role: 'Customer'
        });

        res.status(201).json({
            message: 'تم إنشاء الحساب بنجاح',
            userId: user._id,
            phone: user.phone,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: 'رقم الهاتف أو كلمة المرور غير صحيحة' });
        }

        if (user.isBanned) {
            return res.status(403).json({ 
                message: 'هذا الحساب محظور', 
                banReason: user.banReason 
            });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'رقم الهاتف أو كلمة المرور غير صحيحة' });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'تم تسجيل الدخول بنجاح',
            token,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = {
    registerCustomer,
    login
};