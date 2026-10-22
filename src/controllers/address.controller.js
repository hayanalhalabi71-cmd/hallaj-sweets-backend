const Address = require('../models/Address');

const getMyAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ customer: req.user._id });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const createAddress = async (req, res) => {
    try {
        const { addressText } = req.body;

        const address = await Address.create({
            customer: req.user._id,
            addressText
        });

        res.status(201).json({
            message: 'تم حفظ العنوان بنجاح',
            address
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findOneAndDelete({ _id: id, customer: req.user._id });

        if (!address) {
            return res.status(404).json({ message: 'العنوان غير موجود أو ليس لديك صلاحية لحذفه' });
        }

        res.status(200).json({ message: 'تم حذف العنوان بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = {
    getMyAddresses,
    createAddress,
    deleteAddress
};