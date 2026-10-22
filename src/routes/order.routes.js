const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getAdminStats
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.post('/', protect, authorize('Customer'), createOrder);
router.get('/my-orders', protect, authorize('Customer'), getMyOrders);

router.get('/', protect, authorize('Admin', 'Employee'), getAllOrders);
router.patch('/:id/status', protect, authorize('Admin', 'Employee'), updateOrderStatus);

router.get('/stats/admin', protect, authorize('Admin'), getAdminStats);

module.exports = router;