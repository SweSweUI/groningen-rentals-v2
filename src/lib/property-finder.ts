import type { Property } from './api';
import { scrapeAllSources } from './smart-scraper';

// Cache for properties - now with persistent storage
let propertiesCache: Property[] = [];
let lastCacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for more stability

// Generate a consistent seed for property generation based on date
const getPropertySeed = () => {
  const now = new Date();
  // Use date string to ensure same properties are generated throughout the day
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};

export const findPropertyById = async (id: string): Promise<Property | null> => {
  const now = Date.now();

  // Refresh cache if needed
  if (propertiesCache.length === 0 || now - lastCacheTime > CACHE_DURATION) {
    try {
      // Set a consistent seed for property generation
      const seed = getPropertySeed();
      propertiesCache = await scrapeAllSources();
      lastCacheTime = now;

      // Store in sessionStorage for consistency within the session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('properties_cache', JSON.stringify({
          properties: propertiesCache,
          timestamp: now,
          seed
        }));
      }
    } catch (error) {
      console.error('Error refreshing properties cache:', error);

      // Try to load from sessionStorage as fallback
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem('properties_cache');
        if (cached) {
          try {
            const { properties } = JSON.parse(cached);
            propertiesCache = properties;
          } catch (e) {
            console.error('Error parsing cached properties:', e);
          }
        }
      }

      if (propertiesCache.length === 0) {
        return null;
      }
    }
  } else if (typeof window !== 'undefined' && propertiesCache.length === 0) {
    // Try to load from sessionStorage if cache is empty
    const cached = sessionStorage.getItem('properties_cache');
    if (cached) {
      try {
        const { properties, timestamp } = JSON.parse(cached);
        if (now - timestamp < CACHE_DURATION) {
          propertiesCache = properties;
          lastCacheTime = timestamp;
        }
      } catch (e) {
        console.error('Error parsing cached properties:', e);
      }
    }
  }

  // Find property by ID
  const property = propertiesCache.find(p => p.id === id);

  if (!property) {
    console.log('Property not found:', id);
    console.log('Available property IDs:', propertiesCache.slice(0, 5).map(p => p.id));
  }

  return property || null;
};

export const getAllProperties = async (): Promise<Property[]> => {
  const now = Date.now();

  // Refresh cache if needed
  if (propertiesCache.length === 0 || now - lastCacheTime > CACHE_DURATION) {
    try {
      const seed = getPropertySeed();
      propertiesCache = await scrapeAllSources();
      lastCacheTime = now;

      // Store in sessionStorage for consistency
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('properties_cache', JSON.stringify({
          properties: propertiesCache,
          timestamp: now,
          seed
        }));
      }
    } catch (error) {
      console.error('Error refreshing properties cache:', error);

      // Try to load from sessionStorage as fallback
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem('properties_cache');
        if (cached) {
          try {
            const { properties } = JSON.parse(cached);
            propertiesCache = properties;
          } catch (e) {
            console.error('Error parsing cached properties:', e);
          }
        }
      }

      return [];
    }
  } else if (typeof window !== 'undefined' && propertiesCache.length === 0) {
    // Try to load from sessionStorage if cache is empty
    const cached = sessionStorage.getItem('properties_cache');
    if (cached) {
      try {
        const { properties, timestamp } = JSON.parse(cached);
        if (now - timestamp < CACHE_DURATION) {
          propertiesCache = properties;
          lastCacheTime = timestamp;
        }
      } catch (e) {
        console.error('Error parsing cached properties:', e);
      }
    }
  }

  return propertiesCache;
};
