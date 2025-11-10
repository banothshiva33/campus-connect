const About = require('../models/About');

// @desc    Get about content
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
    try {
        let about = await About.findOne().sort({ createdAt: -1 });
        
        if (!about) {
            // Create default about content if none exists
            about = await About.create({
                content: 'Welcome to CampusConnect! This platform brings together all academic and extracurricular events of our institution into a single online space.',
                lastUpdatedBy: req.user ? req.user.id : 'system'
            });
        }
        
        res.json(about);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update about content
// @route   PUT /api/about
// @access  Private (Admin)
exports.updateAbout = async (req, res) => {
    try {
        const { content } = req.body;
        
        let about = await About.findOne().sort({ createdAt: -1 });
        
        if (about) {
            about.content = content;
            about.lastUpdatedBy = req.user.id;
            await about.save();
        } else {
            about = await About.create({
                content,
                lastUpdatedBy: req.user.id
            });
        }
        
        res.json(about);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};