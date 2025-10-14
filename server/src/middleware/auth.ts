import { Request, Response, NextFunction } from 'express';
import { supabase, getSupabaseClient } from '../config/supabase';

/**
 * Middleware to verify Supabase JWT token
 * Extracts user information and attaches to req.user
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user and user-scoped supabase client to request
    req.user = {
      id: data.user.id,
      email: data.user.email!,
    };
    req.accessToken = token;
    req.supabase = getSupabaseClient(token);

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate user',
    });
  }
};