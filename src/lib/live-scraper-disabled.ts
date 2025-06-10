import type { Property } from './api';

// Disabled live scraper for production deployment
// This file replaces the live-scraper.ts to avoid Playwright build issues

// Mock live scraper functions that return empty results
export const scrapePararius = async (): Promise<Property[]> => {
  console.log('Live scraping disabled in production build');
  return [];
};

export const scrapeFunda = async (): Promise<Property[]> => {
  console.log('Live scraping disabled in production build');
  return [];
};

export const scrapeKamernet = async (): Promise<Property[]> => {
  console.log('Live scraping disabled in production build');
  return [];
};

export const scrapeAllSources = async (): Promise<Property[]> => {
  console.log('Live scraping disabled in production build');
  return [];
};

export const getNewListings = async (): Promise<Property[]> => {
  console.log('Live scraping disabled in production build');
  return [];
};

export const scrapeFromSource = async (source: string): Promise<Property[]> => {
  console.log(`Live scraping for ${source} disabled in production build`);
  return [];
};
