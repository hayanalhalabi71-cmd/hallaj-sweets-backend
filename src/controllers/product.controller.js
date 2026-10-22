const Product = require('../models/Product');
const Category = require('../models/Category');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name description');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category', 'name description');
        
        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, category, priceOptions, isAvailable } = req.body;

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'القسم المحدد غير موجود' });
        }

        const product = await Product.create({
            name,
            description,
            category,
            priceOptions,
            isAvailable
        });

        res.status(201).json({
            message: 'تم إضافة المنتج بنجاح',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, priceOptions, isAvailable } = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            { name, description, category, priceOptions, isAvailable },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }

        res.status(200).json({
            message: 'تم تحديث المنتج بنجاح',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }

        res.status(200).json({ message: 'تم حذف المنتج بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};