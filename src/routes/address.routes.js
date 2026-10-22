const express = require('express');
const router = express.Router();
const { getMyAddresses, createAddress, deleteAddress } = require('../controllers/address.controller');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.use(protect, authorize('Customer'));

router.get('/', getMyAddresses);
router.post('/', createAddress);
router.delete('/:id', deleteAddress);

module.exports = router;