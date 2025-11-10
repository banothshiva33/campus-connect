const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create profiles uploads directory if it doesn't exist
const profilesDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
    console.log('📁 Profiles upload directory created successfully');
}

// Configure storage for profile photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profilesDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and user ID
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + fileExtension);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed for profile photos!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit for profile photos
    }
});

module.exports = upload;