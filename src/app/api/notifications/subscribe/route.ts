import { type NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime for notification operations
export const runtime = 'nodejs';
import { addSubscriber, getAllSubscribers } from '@/lib/notification-utils';
import { validateInput, subscriptionSchema } from '@/lib/validation';
import { sanitizeError, sanitizeInput } from '@/lib/security';

interface Subscriber {
  email: string;
  subscribed: Date;
  preferences: {
    minPrice?: number;
    maxPrice?: number;
    propertyTypes?: string[];
    areas?: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(subscriptionSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid subscription data',
          details: validation.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, preferences = {} } = validation.data;

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    // Check if already subscribed
    const subscribers = getAllSubscribers();
    const existingSubscriber = subscribers.find(sub => sub.email === sanitizedEmail);

    if (existingSubscriber) {
      // Update preferences (sanitize preference values)
      const sanitizedPreferences = {
        ...existingSubscriber.preferences,
        ...preferences,
        propertyTypes: preferences.propertyTypes?.map(type => sanitizeInput(type)).slice(0, 10),
        areas: preferences.areas?.map(area => sanitizeInput(area)).slice(0, 20),
      };

      existingSubscriber.preferences = sanitizedPreferences;

      return NextResponse.json({
        success: true,
        message: 'Subscription preferences updated successfully',
        subscriber: {
          email: existingSubscriber.email,
          subscribed: existingSubscriber.subscribed,
          preferences: existingSubscriber.preferences
        }
      });
    }

    // Add new subscriber with sanitized data
    const newSubscriber: Subscriber = {
      email: sanitizedEmail,
      subscribed: new Date(),
      preferences: {
        ...preferences,
        propertyTypes: preferences.propertyTypes?.map(type => sanitizeInput(type)).slice(0, 10),
        areas: preferences.areas?.map(area => sanitizeInput(area)).slice(0, 20),
      }
    };

    addSubscriber(newSubscriber);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to property notifications',
      subscriber: {
        email: newSubscriber.email,
        subscribed: newSubscriber.subscribed,
        preferences: newSubscriber.preferences
      }
    });

  } catch (error) {
    console.error('Error in subscription endpoint:', error);

    const sanitizedError = sanitizeError(error);

    return NextResponse.json(
      {
        error: 'Failed to process subscription',
        message: sanitizedError.message
      },
      { status: sanitizedError.status }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (only admins can view all subscribers)
    const userRole = request.headers.get('X-User-Role');

    if (userRole !== 'admin') {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: 'Admin privileges required to view subscribers'
        },
        { status: 403 }
      );
    }

    const subscribers = getAllSubscribers();
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers: subscribers.map(sub => ({
        email: sub.email,
        subscribed: sub.subscribed,
        preferences: sub.preferences
      }))
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);

    const sanitizedError = sanitizeError(error);

    return NextResponse.json(
      {
        error: 'Failed to fetch subscribers',
        message: sanitizedError.message
      },
      { status: sanitizedError.status }
    );
  }
}
