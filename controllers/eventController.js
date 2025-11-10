const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendRegistrationConfirmation } = require('../utils/emailService');
const path = require('path');
const fs = require('fs');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Teacher/Admin)
exports.createEvent = async (req, res) => {
    try {
        console.log('🎯 Creating new event...');
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);
        console.log('User creating event:', req.user.id);

        // Validate required fields
        const requiredFields = ['title', 'description', 'date', 'category', 'department', 'venue'];
        const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
        
        if (missingFields.length > 0) {
            console.log('❌ Missing required fields:', missingFields);
            return res.status(400).json({ 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Handle image file
        let imagePath = '';
        if (req.file) {
            // Verify the file was actually saved
            if (fs.existsSync(req.file.path)) {
                imagePath = `/uploads/${req.file.filename}`;
                console.log('✅ Image saved successfully:', imagePath);
            } else {
                console.log('❌ Image file not found at path:', req.file.path);
                // Continue without image if file saving failed
            }
        }

        // Prepare event data
        const eventData = {
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            date: new Date(req.body.date),
            category: req.body.category,
            department: req.body.department.trim(),
            venue: req.body.venue.trim(),
            maxParticipants: parseInt(req.body.maxParticipants) || 0,
            googleFormLink: req.body.googleFormLink ? req.body.googleFormLink.trim() : '',
            image: imagePath,
            createdBy: req.user.id,
            isActive: true
        };

        console.log('📝 Event data prepared:', eventData);

        // Create event in database
        const event = await Event.create(eventData);
        console.log('✅ Event created in database:', event._id);

        // Populate createdBy field for response
        await event.populate('createdBy', 'name email');
        console.log('✅ Event populated with creator info');

        res.status(201).json({
            success: true,
            message: 'Event created successfully!',
            event: event
        });

    } catch (error) {
        console.error('❌ Create event error:', error);
        
        // Delete the uploaded file if event creation failed
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
                console.log('🗑️ Deleted uploaded file due to error:', req.file.path);
            } catch (unlinkError) {
                console.error('❌ Error deleting file:', unlinkError);
            }
        }
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors 
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: 'Event with similar details already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Failed to create event. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        console.log('📋 Fetching all events...');
        const { category, department, startDate, endDate, page = 1, limit = 10 } = req.query;

        let query = { isActive: true };

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
            console.log('🔍 Filtering by category:', category);
        }

        // Filter by department
        if (department) {
            query.department = new RegExp(department, 'i');
            console.log('🔍 Filtering by department:', department);
        }

        // Filter by date range
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
            console.log('🔍 Filtering by date range:', startDate, 'to', endDate);
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        console.log('📊 Pagination - Page:', pageNum, 'Limit:', limitNum, 'Skip:', skip);

        const events = await Event.find(query)
            .populate('createdBy', 'name email')
            .populate('participants', 'name email')
            .sort({ date: 1, createdAt: -1 })
            .limit(limitNum)
            .skip(skip);

        const total = await Event.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum);

        console.log(`✅ Found ${events.length} events out of ${total} total`);

        res.json({
            success: true,
            events,
            pagination: {
                total,
                totalPages,
                currentPage: pageNum,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    } catch (error) {
        console.error('❌ Get events error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch events',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('📖 Fetching event:', eventId);

        if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid event ID format' 
            });
        }

        const event = await Event.findById(eventId)
            .populate('createdBy', 'name email department')
            .populate('participants', 'name email');

        if (!event) {
            console.log('❌ Event not found:', eventId);
            return res.status(404).json({ 
                success: false,
                message: 'Event not found' 
            });
        }

        // Check if event is active
        if (!event.isActive) {
            console.log('❌ Event is not active:', eventId);
            return res.status(404).json({ 
                success: false,
                message: 'Event not found or has been removed' 
            });
        }

        console.log('✅ Event found:', event.title);
        res.json({
            success: true,
            event
        });
    } catch (error) {
        console.error('❌ Get event error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch event',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Teacher/Admin)
exports.updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('✏️ Updating event:', eventId);

        let event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ 
                success: false,
                message: 'Event not found' 
            });
        }

        // Check if user is event creator or admin
        if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            console.log('❌ Unauthorized update attempt by user:', req.user.id);
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized to update this event' 
            });
        }

        // Handle image file if provided
        let imagePath = event.image;
        if (req.file) {
            // Delete old image if exists
            if (event.image) {
                const oldImagePath = path.join(__dirname, '..', event.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log('🗑️ Deleted old image:', oldImagePath);
                }
            }
            
            // Set new image path
            if (fs.existsSync(req.file.path)) {
                imagePath = `/uploads/${req.file.filename}`;
                console.log('✅ New image saved:', imagePath);
            }
        }

        // Prepare update data
        const updateData = {
            ...req.body,
            image: imagePath
        };

        // Convert date if provided
        if (req.body.date) {
            updateData.date = new Date(req.body.date);
        }

        // Convert maxParticipants if provided
        if (req.body.maxParticipants) {
            updateData.maxParticipants = parseInt(req.body.maxParticipants);
        }

        console.log('📝 Update data:', updateData);

        event = await Event.findByIdAndUpdate(eventId, updateData, {
            new: true,
            runValidators: true
        }).populate('createdBy', 'name email');

        console.log('✅ Event updated successfully');

        res.json({
            success: true,
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        console.error('❌ Update event error:', error);
        
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
            message: 'Failed to update event',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Teacher/Admin)
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('🗑️ Deleting event:', eventId);

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ 
                success: false,
                message: 'Event not found' 
            });
        }

        // Check if user is event creator or admin
        if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            console.log('❌ Unauthorized delete attempt by user:', req.user.id);
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized to delete this event' 
            });
        }

        // Delete associated image file
        if (event.image) {
            const imagePath = path.join(__dirname, '..', event.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log('🗑️ Deleted event image:', imagePath);
            }
        }

        // Delete event from database
        await Event.findByIdAndDelete(eventId);
        
        // Also delete related registrations
        await Registration.deleteMany({ event: eventId });
        console.log('🗑️ Deleted related registrations');

        // Delete related notifications
        await Notification.deleteMany({ relatedEvent: eventId });
        console.log('🗑️ Deleted related notifications');

        console.log('✅ Event deleted successfully');
        res.json({ 
            success: true,
            message: 'Event deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Delete event error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete event',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private (Student)
exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('🎫 Registering for event:', eventId);
        console.log('User registering:', req.user.id);
        console.log('Registration data:', req.body);

        const event = await Event.findById(eventId);
        const user = await User.findById(req.user.id);

        if (!event) {
            console.log('❌ Event not found for registration');
            return res.status(404).json({ 
                success: false,
                message: 'Event not found' 
            });
        }

        if (!user) {
            console.log('❌ User not found for registration');
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Check if event is active
        if (!event.isActive) {
            console.log('❌ Event is not active');
            return res.status(400).json({ 
                success: false,
                message: 'This event is no longer available for registration' 
            });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            event: eventId,
            user: req.user.id
        });

        if (existingRegistration) {
            console.log('❌ User already registered for this event');
            return res.status(400).json({ 
                success: false,
                message: 'Already registered for this event' 
            });
        }

        // Check if event has participant limit
        if (event.maxParticipants > 0 && event.participants.length >= event.maxParticipants) {
            console.log('❌ Event is full');
            return res.status(400).json({ 
                success: false,
                message: 'Event is full' 
            });
        }

        // Get form data from request body
        const { 
            studentId, 
            phone, 
            year, 
            section, 
            additionalInfo 
        } = req.body;

        // Validate required fields
        if (!studentId || !studentId.trim()) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        if (!phone || !phone.trim()) {
            return res.status(400).json({ 
                success: false,
                message: 'Phone number is required' 
            });
        }

        // Create registration with form data
        const registration = await Registration.create({
            event: eventId,
            user: req.user.id,
            studentDetails: {
                studentId: studentId.trim(),
                phone: phone.trim(),
                year: year ? year.trim() : '',
                section: section ? section.trim() : '',
                additionalInfo: additionalInfo ? additionalInfo.trim() : ''
            }
        });

        console.log('✅ Registration created:', registration._id);

        // Add user to event participants
        await Event.findByIdAndUpdate(eventId, {
            $push: { participants: req.user.id }
        });

        console.log('✅ User added to event participants');

        // Send confirmation email with student details
        try {
            await sendRegistrationConfirmation(
                user.email, 
                user.name, 
                event, 
                registration._id,
                {
                    studentId: studentId.trim(),
                    phone: phone.trim(),
                    year: year ? year.trim() : '',
                    section: section ? section.trim() : '',
                    additionalInfo: additionalInfo ? additionalInfo.trim() : ''
                }
            );
            console.log('✅ Confirmation email sent to:', user.email);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            // Don't fail the registration if email fails
        }

        // Create notification
        await Notification.create({
            user: req.user.id,
            message: `You have successfully registered for "${event.title}"`,
            type: 'registration_confirmation',
            relatedEvent: event._id
        });

        console.log('✅ Notification created');

        res.status(201).json({
            success: true,
            message: 'Successfully registered for event!',
            registration,
            studentDetails: {
                studentId,
                phone,
                year,
                section,
                additionalInfo
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get user's registered events
// @route   GET /api/events/my/registrations
// @access  Private
exports.getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('📋 Fetching registrations for user:', userId);

        const registrations = await Registration.find({ user: userId })
            .populate({
                path: 'event',
                populate: {
                    path: 'createdBy',
                    select: 'name email department'
                }
            })
            .sort({ registrationDate: -1 });

        console.log(`✅ Found ${registrations.length} registrations for user`);

        res.json({
            success: true,
            registrations
        });
    } catch (error) {
        console.error('❌ Get registrations error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch registrations',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Check if user is registered for event
// @route   GET /api/events/:id/check-registration
// @access  Private
exports.checkRegistration = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;
        
        console.log('🔍 Checking registration for event:', eventId, 'user:', userId);

        const registration = await Registration.findOne({
            event: eventId,
            user: userId
        });

        const isRegistered = !!registration;

        console.log('✅ Registration check result:', isRegistered);

        res.json({
            success: true,
            isRegistered: isRegistered,
            registrationId: registration?._id 
        });
    } catch (error) {
        console.error('❌ Check registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to check registration status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};