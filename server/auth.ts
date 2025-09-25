import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request } from 'express';
import { storage } from './storage';

// Define User interface to match schema
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date | null;
  googleId?: string;
  profileImage?: string;
}

// Extend Express User interface
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      role: 'admin' | 'user';
      createdAt: Date | null;
      googleId?: string;
      profileImage?: string;
    }
  }
}

// Configure Google OAuth Strategy only if environment variables are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || '');

    if (existingUser) {
      // For existing user, just return them (we'll extend storage later to update Google info)
      return done(null, existingUser as Express.User);
    }

    // Create new user
    const newUser = await storage.createUser({
      username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || `user_${profile.id}`,
      email: profile.emails?.[0]?.value || '',
      password: 'oauth_user', // Placeholder for OAuth users
      role: 'user' // Default role
    });

    return done(null, newUser as Express.User);
  } catch (error) {
    return done(error, undefined);
  }
  }));
} else {
  console.warn('Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are missing');
}

// Serialize user for session
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user as Express.User);
  } catch (error) {
    done(error, null);
  }
});

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: any, next: any) => {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
};

export default passport;