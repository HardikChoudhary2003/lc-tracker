// Middleware to protect routes

// Ensure user is authenticated
export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
}

// Ensure user is NOT authenticated (for routes that should only be accessed by guests)
export function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/dashboard'); // Updated from '/dashboard.html' to '/dashboard'
  }
}