import { type NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime for JWT operations
export const runtime = 'nodejs';
import { verifyJWTToken, sanitizeError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: 'Not authenticated',
          message: 'No authentication token found',
        },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const payload = await verifyJWTToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          error: 'Invalid token',
          message: 'Authentication token is invalid or expired',
        },
        { status: 401 }
      );
    }

    // Return user information
    return NextResponse.json(
      {
        success: true,
        user: {
          id: payload.userId,
          email: payload.email,
          name: payload.email === 'demo@groningenrentals.com' ? 'Demo User' : 'Admin User',
          role: payload.role,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Auth check error:', error);

    const sanitizedError = sanitizeError(error);

    return NextResponse.json(
      {
        error: 'Authentication check failed',
        message: sanitizedError.message,
      },
      { status: sanitizedError.status }
    );
  }
}
