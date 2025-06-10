import { Resend } from 'resend';

// Initialize Resend conditionally (only if API key is available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

interface ScrapedProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  size: string;
  rooms: number;
  image: string;
  images: string[];
  sourceUrl: string;
  agent: string;
  description: string;
  listedDate: string;
  daysAgo?: number;
  source?: string;
}

// Simple in-memory storage for demo (in production, use a real database)
const subscribers: Subscriber[] = [];

// Helper function to get all subscribers (for notifications)
export function getAllSubscribers(): Subscriber[] {
  return subscribers;
}

// Helper function to add subscriber
export function addSubscriber(subscriber: Subscriber) {
  subscribers.push(subscriber);
}

// Helper function to send notification emails
export async function sendNotificationEmails(newProperties: ScrapedProperty[]) {
  if (subscribers.length === 0 || newProperties.length === 0) {
    return { sent: 0, errors: 0 };
  }

  console.log(`📧 Sending notifications to ${subscribers.length} subscribers for ${newProperties.length} new properties`);

  let sent = 0;
  let errors = 0;

  // Send notifications to each subscriber
  for (const subscriber of subscribers) {
    try {
      const filteredProperties = filterPropertiesForSubscriber(newProperties, subscriber);

      if (filteredProperties.length === 0) {
        continue; // Skip if no matching properties
      }

      const emailContent = createPropertyAlertEmailTemplate(filteredProperties, subscriber);

      if (!resend) {
        console.log(`📧 Would send email to ${subscriber.email} for ${filteredProperties.length} properties (Resend not configured)`);
        sent++;
        continue;
      }

      await resend.emails.send({
        from: 'Groningen Rentals <hello@groningen-rentals.com>',
        to: [subscriber.email],
        subject: `🏠 ${filteredProperties.length} New Property${filteredProperties.length > 1 ? 'ies' : ''} in Groningen!`,
        html: emailContent,
        text: `New properties found in Groningen! Check them out at https://groningen-rentals.com`,
      });

      sent++;
      console.log(`✅ Email sent to ${subscriber.email} for ${filteredProperties.length} properties`);
    } catch (error) {
      errors++;
      console.error(`❌ Failed to send email to ${subscriber.email}:`, error);
    }
  }

  console.log(`📧 Email results: ${sent} sent, ${errors} failed`);
  return { sent, errors };
}

// Helper function to filter properties based on subscriber preferences
function filterPropertiesForSubscriber(properties: ScrapedProperty[], subscriber: Subscriber): ScrapedProperty[] {
  const { preferences } = subscriber;

  return properties.filter(property => {
    // Filter by price range
    if (preferences.minPrice || preferences.maxPrice) {
      const price = property.price;
      if (preferences.minPrice && price < preferences.minPrice) return false;
      if (preferences.maxPrice && price > preferences.maxPrice) return false;
    }

    // Filter by property types
    if (preferences.propertyTypes && preferences.propertyTypes.length > 0) {
      const propertyType = getPropertyType(property);
      if (!preferences.propertyTypes.includes(propertyType)) return false;
    }

    // Filter by areas (simple keyword matching)
    if (preferences.areas && preferences.areas.length > 0) {
      const locationLower = property.location.toLowerCase();
      const titleLower = property.title.toLowerCase();
      const hasAreaMatch = preferences.areas.some(area =>
        locationLower.includes(area.toLowerCase()) ||
        titleLower.includes(area.toLowerCase())
      );
      if (!hasAreaMatch) return false;
    }

    return true;
  });
}

// Helper function to determine property type
function getPropertyType(property: ScrapedProperty): string {
  if (property.rooms === 1) return 'Studio';
  if (property.rooms === 2) return '2-Room Apartment';
  if (property.rooms === 3) return '3-Room Apartment';
  if (property.rooms && property.rooms >= 4) return 'Large Apartment';

  const title = property.title.toLowerCase();
  if (title.includes('studio')) return 'Studio';
  if (title.includes('apartment') || title.includes('flat')) return 'Apartment';
  if (title.includes('house') || title.includes('woning')) return 'House';
  if (title.includes('room') || title.includes('kamer')) return 'Room';

  return 'Apartment'; // Default
}

// Email template for property alerts
function createPropertyAlertEmailTemplate(properties: ScrapedProperty[], subscriber: Subscriber): string {
  const propertyCards = properties.map(property => `
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0;">
      <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">${property.title}</h3>
      <div style="color: #6b7280; margin-bottom: 10px;">
        <strong style="color: #059669; font-size: 16px;">€${property.price}</strong> • ${property.location}
      </div>
      ${property.image ? `<img src="${property.image}" alt="${property.title}" style="width: 100%; max-width: 300px; height: 200px; object-fit: cover; border-radius: 6px; margin: 10px 0;">` : ''}
      <div style="margin: 15px 0;">
        <span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px;">
          ${property.agent}
        </span>
        <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
          ${getPropertyType(property)}
        </span>
      </div>
      <a href="${property.sourceUrl}" style="display: inline-block; background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px;">
        View Property →
      </a>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Properties in Groningen</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">🏠 Groningen Rentals</h1>
          <p style="color: #6b7280; margin: 5px 0;">New properties matching your preferences!</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #1f2937;">
            ${properties.length} New Property${properties.length > 1 ? 'ies' : ''} Found
          </h2>
          <p style="margin: 0; color: #6b7280;">
            Here are the latest rental properties that match your preferences in Groningen:
          </p>
        </div>

        ${propertyCards}

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p style="margin: 0 0 15px 0; color: #6b7280;">
            Want to see all available properties?
          </p>
          <a href="https://groningen-rentals.com" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Browse All Properties
          </a>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
          <p>You're receiving this because you subscribed to Groningen Rentals property alerts.</p>
          <p>© 2024 Groningen Rentals. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}
