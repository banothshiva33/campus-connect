const express = require('express');
const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    getMyRegistrations,
    checkRegistration
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, authorize('teacher', 'admin'), upload.single('image'), createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('teacher', 'admin'), upload.single('image'), updateEvent)
    .delete(protect, authorize('teacher', 'admin'), deleteEvent);

router.get('/:id/check-registration', protect, checkRegistration);
router.post('/:id/register', protect, authorize('student'), registerForEvent);
router.get('/my/registrations', protect, getMyRegistrations);

module.exports = router;