// ... existing code ... <imports and JWT_SECRET definition>

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32-chars';

// ... existing code ... <NEXTAUTH_SECRET production check>

// Add runtime check function instead of module-level validation
function validateEncryptionKey() {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY === 'fallback-encryption-key-32-chars') {
      throw new Error('ENCRYPTION_KEY must be set in production');
    }
  }
}
