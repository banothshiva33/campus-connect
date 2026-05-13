const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Increase payload size limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Uploads directory created at:', uploadsDir);
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir, {
    fallthrough: true,
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));
app.use('/api/about', require('./routes/about'));
app.use('/api/notifications', require('./routes/notifications'));

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'CampusConnect API is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            events: '/api/events',
            users: '/api/users',
            about: '/api/about',
            notifications: '/api/notifications'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ 
            message: 'File too large. Please upload images smaller than 5MB.' 
        });
    }
    
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle unhandled routes
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
});