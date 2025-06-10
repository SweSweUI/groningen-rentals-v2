import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';

// Environment validation
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32-chars';

// Ensure secrets are properly configured
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET === 'fallback-secret-key-change-in-production') {
    throw new Error('NEXTAUTH_SECRET must be set in production');
  }
  if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY === 'fallback-encryption-key-32-chars') {
    throw new Error('ENCRYPTION_KEY must be set in production');
  }
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT token management
interface CustomJWTPayload {
  userId: string;
  email: string;
  role: 'demo' | 'admin';
  sessionId: string;
  iat?: number;
  exp?: number;
}

export async function createJWTToken(payload: Omit<CustomJWTPayload, 'sessionId' | 'iat' | 'exp'>): Promise<string> {
  const sessionId = uuidv4();
  const secret = new TextEncoder().encode(JWT_SECRET);

  const token = await new SignJWT({
    ...payload,
    sessionId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

export async function verifyJWTToken(token: string): Promise<CustomJWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as CustomJWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove basic XSS characters
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Rate limiting storage (in-memory for demo, use Redis in production)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 60,
  windowMs = 60000
): { allowed: boolean; resetTime: number; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // First request or window expired
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, resetTime, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return { allowed: false, resetTime: record.resetTime, remaining: 0 };
  }

  // Increment counter
  record.count++;
  rateLimitStore.set(identifier, record);
  return { allowed: true, resetTime: record.resetTime, remaining: maxRequests - record.count };
}

// CSRF token generation
export function generateCSRFToken(): string {
  return uuidv4();
}

// Session management
export interface SessionData {
  userId: string;
  email: string;
  role: 'demo' | 'admin';
  sessionId: string;
  createdAt: number;
  lastActivity: number;
}

const sessionStore = new Map<string, SessionData>();

export function createSession(sessionData: Omit<SessionData, 'sessionId' | 'createdAt' | 'lastActivity'>): string {
  const sessionId = uuidv4();
  const now = Date.now();

  const session: SessionData = {
    ...sessionData,
    sessionId,
    createdAt: now,
    lastActivity: now,
  };

  sessionStore.set(sessionId, session);
  return sessionId;
}

export function getSession(sessionId: string): SessionData | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;

  // Check if session expired (24 hours)
  const maxAge = 24 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > maxAge) {
    sessionStore.delete(sessionId);
    return null;
  }

  // Update last activity
  session.lastActivity = Date.now();
  sessionStore.set(sessionId, session);

  return session;
}

export function deleteSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;

  for (const [sessionId, session] of sessionStore.entries()) {
    if (now - session.createdAt > maxAge) {
      sessionStore.delete(sessionId);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

// Error sanitization
export function sanitizeError(error: unknown): { message: string; status: number } {
  if (process.env.NODE_ENV === 'production') {
    // In production, return generic errors to prevent information leakage
    return {
      message: 'An internal error occurred',
      status: 500
    };
  }

  // In development, return more detailed errors
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    };
  }

  return {
    message: 'Unknown error occurred',
    status: 500
  };
}
