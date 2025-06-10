import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(254, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
});

// Subscription schemas
export const subscriptionSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(254, 'Email is too long'),
  preferences: z.object({
    minPrice: z.number().min(0).max(10000).optional(),
    maxPrice: z.number().min(0).max(10000).optional(),
    propertyTypes: z.array(z.string()).max(10).optional(),
    areas: z.array(z.string()).max(20).optional(),
  }).optional(),
});

// Admin schemas
export const adminLogSchema = z.object({
  type: z.enum(['scraping_run', 'error', 'notification']),
  data: z.object({
    success: z.boolean().optional(),
    totalProperties: z.number().min(0).optional(),
    newProperties: z.number().min(0).optional(),
    propertiesByAgency: z.record(z.number()).optional(),
    errors: z.array(z.string()).optional(),
    duration: z.number().min(0).optional(),
    message: z.string().optional(),
  }),
});

// Property schemas
export const propertySchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  price: z.number().min(0).max(50000),
  location: z.string().min(1).max(100),
  size: z.string().min(1).max(50),
  rooms: z.number().min(0).max(20),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  sourceUrl: z.string().url(),
  agent: z.string().min(1).max(100),
  description: z.string().max(1000),
  listedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  daysAgo: z.number().min(0).max(365).optional(),
});

// Security headers validation
export const securityHeadersSchema = z.object({
  'x-forwarded-for': z.string().optional(),
  'user-agent': z.string().max(500).optional(),
  'referer': z.string().url().optional(),
  'origin': z.string().url().optional(),
});

// Rate limiting identifier schema
export const rateLimitIdentifierSchema = z.object({
  ip: z.string().ip().optional(),
  userId: z.string().optional(),
  email: z.string().email().optional(),
});

// Generic API response schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error.issues };
}

// Common validation patterns
export const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Sanitization functions
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeString(input: string, maxLength = 255): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove basic XSS characters
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function sanitizeNumber(input: unknown, min = 0, max: number = Number.MAX_SAFE_INTEGER): number {
  const num = Number(input);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

// Input length limits
export const limits = {
  email: 254,
  password: 128,
  title: 200,
  description: 1000,
  name: 100,
  url: 2048,
  uuid: 36,
  shortText: 50,
  mediumText: 255,
  longText: 1000,
} as const;
