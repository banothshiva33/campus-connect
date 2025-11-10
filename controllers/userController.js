const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        console.log('Updating user profile for:', req.user.id);
        console.log('Request body:', req.body);
        console.log('File received:', req.file);

        const userId = req.user.id;
        
        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Handle profile photo upload
        let profilePhotoPath = user.profilePhoto;
        if (req.file) {
            // Verify the file was actually saved
            if (fs.existsSync(req.file.path)) {
                // Delete old profile photo if exists
                if (user.profilePhoto) {
                    const oldPhotoPath = path.join(__dirname, '..', user.profilePhoto);
                    if (fs.existsSync(oldPhotoPath)) {
                        fs.unlinkSync(oldPhotoPath);
                        console.log('🗑️ Deleted old profile photo:', oldPhotoPath);
                    }
                }
                
                profilePhotoPath = `/uploads/profiles/${req.file.filename}`;
                console.log('✅ Profile photo saved:', profilePhotoPath);
            }
        }

        // Prepare update data
        const updateData = {
            ...req.body,
            profilePhoto: profilePhotoPath
        };

        // Remove password from update data if present
        delete updateData.password;

        console.log('Update data:', updateData);

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password');

        console.log('✅ Profile updated successfully');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('❌ Update profile error:', error);
        
        // Delete the uploaded file if update failed
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
                console.log('🗑️ Deleted uploaded file due to error');
            } catch (unlinkError) {
                console.error('❌ Error deleting file:', unlinkError);
            }
        }
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};