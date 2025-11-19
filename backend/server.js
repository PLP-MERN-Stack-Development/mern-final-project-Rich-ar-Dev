const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// ✅ ADD THIS - Simple routes that work without MongoDB
app.get('/', (req, res) => {
  res.json({ 
    message: 'TaskFlow Pro Backend API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'TaskFlow Pro Backend is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// MongoDB connection with timeout and fallback
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MONGODB_URI found, using mock data');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Continuing with mock data mode...');
  }
};

// Import routes safely
const safeRequire = (path, fallbackRouter) => {
  try {
    return require(path);
  } catch (error) {
    console.log(`⚠️  Route ${path} failed, using fallback`);
    return fallbackRouter;
  }
};

// Create fallback routes
const fallbackRouter = express.Router();
fallbackRouter.get('/', (req, res) => res.json({ message: 'Mock endpoint' }));
fallbackRouter.post('/', (req, res) => res.json({ message: 'Mock endpoint', data: req.body }));

// Routes - they won't crash the server if MongoDB is down
app.use('/api/auth', safeRequire('./routes/auth', fallbackRouter));
app.use('/api/projects', safeRequire('./routes/projects', fallbackRouter));
app.use('/api/tasks', safeRequire('./routes/tasks', fallbackRouter));
app.use('/api/comments', safeRequire('./routes/comments', fallbackRouter));

const PORT = process.env.PORT || 5000;

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  });
});