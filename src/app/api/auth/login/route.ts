import { type NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime for bcrypt and crypto operations
export const runtime = 'nodejs';
import { validateInput, loginSchema } from '@/lib/validation';
import { verifyPassword, createJWTToken, createSession, sanitizeError } from '@/lib/security';
import { serialize } from 'cookie';

// Demo users with hashed passwords (in production, use a database)
const DEMO_USERS = {
  'demo@groningenrentals.com': {
    id: 'demo-001',
    email: 'demo@groningenrentals.com',
    passwordHash: '$2a$12$zvjiCTUwvzeokjzPGnSXYeck2WW1KYXrWm7XovpsdrtiGmtZ3N7S2', // "demo2025"
    role: 'demo' as const,
    name: 'Demo User',
  },
  'admin@groningenrentals.com': {
    id: 'admin-001',
    email: 'admin@groningenrentals.com',
    passwordHash: '$2a$12$6BcCz0pM31AdLUM7mvzakexEPw5EVLa.UOH7ITV18VQ8BKY3m7bda', // "admin2025"
    role: 'admin' as const,
    name: 'Admin User',
  },
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(loginSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid email or password format',
          details: validation.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = DEMO_USERS[email.toLowerCase() as keyof typeof DEMO_USERS];
    if (!user) {
      // Use a delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json(
        {
          error: 'Authentication failed',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: 'Authentication failed',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create JWT token
    const token = await createJWTToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set secure HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    };

    const cookie = serialize('auth-token', token, cookieOptions);

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Login error:', error);

    const sanitizedError = sanitizeError(error);

    return NextResponse.json(
      {
        error: 'Login failed',
        message: sanitizedError.message,
      },
      { status: sanitizedError.status }
    );
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  try {
    // Clear the auth cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    // Set cookie with immediate expiration
    const cookie = serialize('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    });

    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Logout error:', error);

    const sanitizedError = sanitizeError(error);

    return NextResponse.json(
      {
        error: 'Logout failed',
        message: sanitizedError.message,
      },
      { status: sanitizedError.status }
    );
  }
}
