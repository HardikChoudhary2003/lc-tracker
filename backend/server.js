import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cron from 'node-cron';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import profileRoutes from './routes/profile.js';

// Import Passport config
import './config/passport-setup.js';

// Import Cron job and manual fetch function
import { scheduleContestFetching, fetchAndStoreContests } from './jobs/contestFetcher.js';

const app = express();

// Trust proxy headers (important for platforms like Render/Heroku)
app.set('trust proxy', 1);

// --- Database Connection ---
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in .env file.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// --- CORS Configuration ---
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
  'http://localhost:5173',
  'https://lctracker.vercel.app' // Ensure this is included
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    }
  },
  credentials: true
}));

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session Configuration ---
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }), // Add MongoStore to persist sessions
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production (HTTPS)
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site (prod), 'lax' for same-site (dev)
  },
}));

// --- Passport Initialization ---
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', apiRoutes); // This should be correctly mounting all /api routes

// Add a route specifically for debugging
app.get('/api-test', (req, res) => {
  res.json({ status: 'API is working' });
});

// --- Admin manual fetch route ---
app.get('/admin/fetch-contests', async (req, res) => {
  try {
    await fetchAndStoreContests();
    res.send('Contest fetch triggered.');
  } catch (error) {
    console.error('Error during fetch:', error);
    res.status(500).send('Error triggering fetch.');
  }
});

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Add better error logging for 404s
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found',
    requestedPath: req.originalUrl,
    method: req.method
  });
});

// --- Scheduled Jobs ---
scheduleContestFetching();

// --- Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
});
