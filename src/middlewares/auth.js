const { verifyToken } = require('../utils/jwtService');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = verifyToken(token);

            const currentUser = await User.findById(decoded.id);

            if (!currentUser) {
                return res.status(401).json({ message: 'المستخدم غير موجود' });
            }

            if (currentUser.isBanned) {
                return res.status(403).json({ 
                    message: 'هذا الحساب محظور', 
                    banReason: currentUser.banReason 
                });
            }

            req.user = currentUser;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'غير مصرح، الرمز غير صالح' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'غير مصرح، لا يوجد رمز وصول' });
    }
};

module.exports = { protect };