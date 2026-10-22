const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.get('/', getAllCategories);

router.post('/', protect, authorize('Admin', 'Employee'), createCategory);

router.put('/:id', protect, authorize('Admin', 'Employee'), updateCategory);

router.delete('/:id', protect, authorize('Admin', 'Employee'), deleteCategory);

module.exports = router;