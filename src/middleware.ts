import { type NextRequest, NextResponse } from 'next/server';
import { verifyJWTToken, checkRateLimit, sanitizeError } from '@/lib/security';
import { validateInput, securityHeadersSchema } from '@/lib/validation';

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/auth/login': { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  '/api/notifications/subscribe': { requests: 10, window: 60 * 60 * 1000 }, // 10 requests per hour
  '/api/scrape-properties': { requests: 30, window: 60 * 60 * 1000 }, // 30 requests per hour
  '/api/admin': { requests: 100, window: 60 * 60 * 1000 }, // 100 requests per hour for admin
  default: { requests: 60, window: 60 * 1000 }, // 60 requests per minute default
};

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/account',
  '/api/admin',
];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
];

// Public routes that don't need rate limiting
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/properties',
  '/sources',
  '/contact',
  '/waitlist',
  '/notifications',
];

function getClientIP(request: NextRequest): string {
  // Get IP from various headers (for different proxy setups)
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const remote = request.headers.get('x-remote-addr');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return real || remote || 'unknown';
}

function getRateLimitConfig(pathname: string) {
  // Check for exact matches first
  if (RATE_LIMITS[pathname as keyof typeof RATE_LIMITS]) {
    return RATE_LIMITS[pathname as keyof typeof RATE_LIMITS];
  }

  // Check for prefix matches
  for (const [route, config] of Object.entries(RATE_LIMITS)) {
    if (route !== 'default' && pathname.startsWith(route)) {
      return config;
    }
  }

  return RATE_LIMITS.default;
}

async function checkAuthentication(request: NextRequest): Promise<{ isAuthenticated: boolean; user?: { userId: string; email: string; role: string }; isAdmin?: boolean }> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { isAuthenticated: false };
  }

  try {
    const payload = await verifyJWTToken(token);
    if (!payload) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      user: payload,
      isAdmin: payload.role === 'admin',
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { isAuthenticated: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  try {
    // Security headers validation
    const headers = Object.fromEntries(request.headers.entries());
    const headerValidation = validateInput(securityHeadersSchema, headers);

    if (!headerValidation.success) {
      console.warn('Invalid security headers:', headerValidation.errors);
    }

    // Rate limiting (skip for public static assets)
    if (!pathname.startsWith('/_next/') && !pathname.startsWith('/favicon')) {
      const rateLimitConfig = getRateLimitConfig(pathname);
      const rateLimitKey = `${clientIP}:${pathname}`;

      const rateLimit = checkRateLimit(
        rateLimitKey,
        rateLimitConfig.requests,
        rateLimitConfig.window
      );

      if (!rateLimit.allowed) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests, please try again later',
            resetTime: rateLimit.resetTime,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': rateLimitConfig.requests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            },
          }
        );
      }

      // Add rate limit headers to response
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', rateLimitConfig.requests.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    }

    // Authentication check for protected routes
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
      const auth = await checkAuthentication(request);

      if (!auth.isAuthenticated) {
        // Redirect to login for page routes, return 401 for API routes
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              error: 'Authentication required',
              message: 'Please log in to access this resource',
            }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check admin access for admin routes
      if (isAdminRoute && !auth.isAdmin) {
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({
              error: 'Admin access required',
              message: 'Insufficient permissions to access this resource',
            }),
            {
              status: 403,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
        return NextResponse.redirect(new URL('/properties', request.url));
      }

      // Add user info to request headers for API routes
      if (pathname.startsWith('/api/') && auth.user) {
        const response = NextResponse.next();
        response.headers.set('X-User-ID', auth.user.userId);
        response.headers.set('X-User-Role', auth.user.role);
        response.headers.set('X-User-Email', auth.user.email);
        return response;
      }
    }

    // Security headers for all responses
    const response = NextResponse.next();

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none';"
    );

    // HSTS for production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }

    return response;

  } catch (error) {
    console.error('Middleware error:', error);

    const sanitizedError = sanitizeError(error);

    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        message: sanitizedError.message,
      }),
      {
        status: sanitizedError.status,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
