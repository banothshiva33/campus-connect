const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, updateProfile, getProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/profileUpload');

const router = express.Router();

router.use(protect);

// Profile routes (accessible by all authenticated users)
router.route('/profile')
    .get(getProfile)
    .put(upload.single('profilePhoto'), updateProfile);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;