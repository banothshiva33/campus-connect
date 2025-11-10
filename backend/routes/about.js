const express = require('express');
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getAbout)
    .put(protect, authorize('admin'), updateAbout);

module.exports = router;