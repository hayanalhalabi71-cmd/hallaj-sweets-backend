const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'هذا القسم موجود مسبقاً' });
        }

        const category = await Category.create({
            name,
            description
        });

        res.status(201).json({
            message: 'تم إنشاء القسم بنجاح',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name, description, isActive },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        res.status(200).json({
            message: 'تم تحديث القسم بنجاح',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        res.status(200).json({ message: 'تم حذف القسم بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};