import { type NextRequest, NextResponse } from 'next/server';
import { validateInput, adminLogSchema } from '@/lib/validation';
import { sanitizeError } from '@/lib/security';

// Force Node.js runtime for admin operations
export const runtime = 'nodejs';

interface AdminStats {
  scraping: {
    lastRun: string;
    nextRun: string;
    totalProperties: number;
    propertiesByAgency: Record<string, number>;
    errors: string[];
    successRate: number;
  };
  notifications: {
    totalSubscribers: number;
    emailsSentToday: number;
    lastNotificationSent: string;
  };
  system: {
    uptime: string;
    memoryUsage: string;
    cacheHitRate: number;
  };
}

// Simple in-memory storage for demo (in production, use a real database)
interface ScrapingRun {
  timestamp: string;
  duration: number;
  totalProperties: number;
  newProperties: number;
  agencies: Record<string, number>;
  propertiesByAgency: Record<string, number>;
  errors: string[];
  success?: boolean;
}

const adminData = {
  scrapingRuns: [] as ScrapingRun[],
  subscribers: [] as string[],
  emailsSent: 0,
  lastNotification: '',
  errors: [] as string[],
  startTime: Date.now()
};

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (middleware should have already verified this)
    const userRole = request.headers.get('X-User-Role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        {
          error: 'Admin access required',
          message: 'Insufficient permissions to access admin statistics'
        },
        { status: 403 }
      );
    }

    const now = new Date();
    const uptime = Date.now() - adminData.startTime;
    const lastRun = adminData.scrapingRuns[adminData.scrapingRuns.length - 1];

    // Calculate next run (every 30 minutes)
    const nextRunTime = lastRun ?
      new Date(new Date(lastRun.timestamp).getTime() + 30 * 60 * 1000) :
      new Date(now.getTime() + 30 * 60 * 1000);

    const stats: AdminStats = {
      scraping: {
        lastRun: lastRun?.timestamp || 'Never',
        nextRun: nextRunTime.toISOString(),
        totalProperties: lastRun?.totalProperties || 0,
        propertiesByAgency: lastRun?.propertiesByAgency || {},
        errors: adminData.errors.slice(-5), // Last 5 errors
        successRate: adminData.scrapingRuns.length > 0 ?
          (adminData.scrapingRuns.filter(r => r.success).length / adminData.scrapingRuns.length) * 100 : 0
      },
      notifications: {
        totalSubscribers: adminData.subscribers.length,
        emailsSentToday: adminData.emailsSent,
        lastNotificationSent: adminData.lastNotification || 'Never'
      },
      system: {
        uptime: formatUptime(uptime),
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        cacheHitRate: 85 // Mock data
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('❌ Admin stats error:', error);
    const sanitizedError = sanitizeError(error);
    return NextResponse.json(
      {
        error: 'Failed to fetch admin stats',
        message: sanitizedError.message
      },
      { status: sanitizedError.status }
    );
  }
}

// Log scraping run
export async function POST(request: NextRequest) {
  try {
    // Authentication is handled by middleware, but let's verify admin role from headers
    const userRole = request.headers.get('X-User-Role');

    if (userRole !== 'admin') {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: 'Admin privileges required'
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = validateInput(adminLogSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid log data format',
          details: validation.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { type, data } = validation.data;

    if (type === 'scraping_run') {
      adminData.scrapingRuns.push({
        timestamp: new Date().toISOString(),
        success: data.success || false,
        totalProperties: data.totalProperties || 0,
        newProperties: data.newProperties || 0,
        agencies: data.propertiesByAgency || {},
        propertiesByAgency: data.propertiesByAgency || {},
        errors: (data.errors || []).slice(0, 10), // Limit errors to prevent overflow
        duration: data.duration || 0
      });

      // Keep only last 24 hours of runs
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      adminData.scrapingRuns = adminData.scrapingRuns.filter(
        run => new Date(run.timestamp).getTime() > dayAgo
      );
    }

    if (type === 'error') {
      const errorMessage = data.message || 'Unknown error';
      adminData.errors.push(`${new Date().toISOString()}: ${errorMessage.slice(0, 200)}`); // Limit error message length
      // Keep only last 50 errors
      if (adminData.errors.length > 50) {
        adminData.errors = adminData.errors.slice(-50);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Admin log error:', error);
    const sanitizedError = sanitizeError(error);
    return NextResponse.json(
      {
        error: 'Failed to log data',
        message: sanitizedError.message
      },
      { status: sanitizedError.status }
    );
  }
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
