const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('Admin', 'Employee'), createProduct);

router.put('/:id', protect, authorize('Admin', 'Employee'), updateProduct);

router.delete('/:id', protect, authorize('Admin', 'Employee'), deleteProduct);

module.exports = router;