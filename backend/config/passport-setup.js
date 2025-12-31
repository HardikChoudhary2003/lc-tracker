import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Get frontend URL from environment variables with fallback to localhost
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'; // Add backend URL from environment variables

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not defined in .env. Google OAuth will not function.');
}

// --- User Serialization/Deserialization ---
// Determines which data of the user object should be stored in the session.
// The result of the serializeUser method is attached to the session as req.session.passport.user = {id: 'xyz'}
passport.serializeUser((user, done) => {
    done(null, user.id); // Store only the user's MongoDB ID in the session
});

// The first argument of deserializeUser corresponds to the key of the user object that was given to the done function.
// So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc).
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Attach the full user object to req.user
    } catch (err) {
        done(err, null);
    }
});

// --- Google OAuth 2.0 Strategy ---
// Only configure strategy if credentials exist
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy.Strategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: `${BACKEND_URL}/auth/google/callback`, // Use BACKEND_URL dynamically
            scope: ['profile', 'email'] // Request user's profile and email
        },
        async (accessToken, refreshToken, profile, done) => {
            // Add logging for debugging
            console.log('Google profile received:', profile);

            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value || '',
                // You can add more fields from the profile if needed
            };

            try {
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    console.log('User found:', user);
                    done(null, user);
                } else {
                    console.log('Creating new user:', newUser);
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.error('Error in Google strategy callback:', err);
                done(err, null);
            }
        })
    );
}