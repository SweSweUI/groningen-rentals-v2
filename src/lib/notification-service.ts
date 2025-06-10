import type { Property } from './api';

export interface PropertyNotification {
  id: string;
  propertyId: string;
  title: string;
  price: number;
  location: string;
  source: string;
  timestamp: string;
  read: boolean;
  urgent: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  immediate: boolean;
  dailyDigest: boolean;
  priceRange: { min: number; max: number };
  locations: string[];
  propertyTypes: string[];
}

class NotificationService {
  private notifications: PropertyNotification[] = [];
  private lastCheckTime = 0;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private preferences: NotificationPreferences = {
    email: true,
    browser: true,
    immediate: true,
    dailyDigest: false,
    priceRange: { min: 0, max: 2000 },
    locations: ['Centrum', 'Noord', 'Zuid', 'Oost', 'West'],
    propertyTypes: ['Studio', 'Apartment', 'House']
  };

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.loadNotifications();
      this.loadPreferences();
      this.requestNotificationPermission();
    }
  }

  // Request browser notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  // Start monitoring for new properties every 30 minutes
  startMonitoring(): void {
    console.log('🔔 Starting property monitoring service...');

    // Initial check
    this.checkForNewProperties();

    // Set up 30-minute intervals
    this.monitoringInterval = setInterval(() => {
      this.checkForNewProperties();
    }, 30 * 60 * 1000); // 30 minutes
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('🔕 Stopped property monitoring');
  }

  // Check for new properties from all sources
  async checkForNewProperties(): Promise<void> {
    try {
      console.log('🔍 Checking for new properties from Gruno and other agencies...');

      // Import here to avoid circular dependencies
      const { scrapeAllRealProperties } = await import('./real-property-scraper');
      const currentProperties = await scrapeAllRealProperties();

      const storedPropertyIds = this.getStoredPropertyIds();
      const newProperties = currentProperties.filter(property =>
        !storedPropertyIds.has(property.id) && this.matchesPreferences(property)
      );

      if (newProperties.length > 0) {
        console.log(`🚨 Found ${newProperties.length} new properties!`);

        for (const property of newProperties) {
          await this.createNotification(property);
        }

        this.updateStoredPropertyIds(currentProperties.map(p => p.id));
        this.saveNotifications();

        // Send summary notification if multiple properties found
        if (newProperties.length > 1) {
          this.sendBrowserNotification(
            `🏠 ${newProperties.length} New Properties Found!`,
            `New listings from Gruno Verhuur and other agencies`
          );
        }
      } else {
        console.log('✅ No new properties found');
      }

      this.lastCheckTime = Date.now();
    } catch (error) {
      console.error('❌ Error checking for new properties:', error);
    }
  }

  // Create notification for a new property
  async createNotification(property: Property): Promise<void> {
    const isUrgent = this.isUrgentProperty(property);

    const notification: PropertyNotification = {
      id: `notif-${property.id}-${Date.now()}`,
      propertyId: property.id,
      title: property.title,
      price: property.price,
      location: property.location,
      source: property.source,
      timestamp: new Date().toISOString(),
      read: false,
      urgent: isUrgent
    };

    this.notifications.unshift(notification);

    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Send immediate notification if enabled
    if (this.preferences.immediate) {
      await this.sendImmediateNotification(property, isUrgent);
    }

    console.log(`✅ Created notification for: ${property.title} - €${property.price}`);
  }

  // Send immediate browser notification
  async sendImmediateNotification(property: Property, isUrgent: boolean): Promise<void> {
    const emoji = isUrgent ? '🚨' : '🏠';
    const urgentText = isUrgent ? ' (URGENT!)' : '';

    this.sendBrowserNotification(
      `${emoji} New Property from ${property.source}${urgentText}`,
      `${property.title} - €${property.price}/month in ${property.location}`
    );
  }

  // Send browser notification
  sendBrowserNotification(title: string, body: string): void {
    if (typeof window === 'undefined' || !this.preferences.browser || Notification.permission !== "granted") {
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'groningen-rental',
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  }

  // Check if property matches user preferences
  matchesPreferences(property: Property): boolean {
    // Price range check
    if (property.price < this.preferences.priceRange.min ||
        property.price > this.preferences.priceRange.max) {
      return false;
    }

    // Location check
    if (this.preferences.locations.length > 0) {
      const matchesLocation = this.preferences.locations.some(location =>
        property.location.toLowerCase().includes(location.toLowerCase()) ||
        property.neighborhood?.toLowerCase().includes(location.toLowerCase())
      );
      if (!matchesLocation) return false;
    }

    // Property type check
    if (this.preferences.propertyTypes.length > 0) {
      if (!this.preferences.propertyTypes.includes(property.type)) {
        return false;
      }
    }

    return true;
  }

  // Determine if property is urgent based on criteria
  isUrgentProperty(property: Property): boolean {
    // Properties from Gruno Verhuur are always considered urgent
    if (property.source.toLowerCase().includes('gruno')) {
      return true;
    }

    // Properties under €800 or over €1500 are urgent
    if (property.price <= 800 || property.price >= 1500) {
      return true;
    }

    // Properties in Centrum are urgent
    if (property.location.toLowerCase().includes('centrum')) {
      return true;
    }

    return false;
  }

  // Get all notifications
  getNotifications(): PropertyNotification[] {
    return this.notifications;
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  // Get stored property IDs to compare against
  getStoredPropertyIds(): Set<string> {
    if (typeof window === 'undefined') return new Set(); // Skip on server side

    const stored = localStorage.getItem('groningen_property_ids');
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored property IDs:', error);
      }
    }
    return new Set();
  }

  // Update stored property IDs
  updateStoredPropertyIds(propertyIds: string[]): void {
    if (typeof window === 'undefined') return; // Skip on server side
    localStorage.setItem('groningen_property_ids', JSON.stringify(propertyIds));
  }

  // Save notifications to localStorage
  saveNotifications(): void {
    if (typeof window === 'undefined') return; // Skip on server side
    localStorage.setItem('groningen_notifications', JSON.stringify(this.notifications));
  }

  // Load notifications from localStorage
  loadNotifications(): void {
    if (typeof window === 'undefined') return; // Skip on server side

    const stored = localStorage.getItem('groningen_notifications');
    if (stored) {
      try {
        this.notifications = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.notifications = [];
      }
    }
  }

  // Save preferences
  savePreferences(): void {
    if (typeof window === 'undefined') return; // Skip on server side
    localStorage.setItem('groningen_notification_preferences', JSON.stringify(this.preferences));
  }

  // Load preferences
  loadPreferences(): void {
    if (typeof window === 'undefined') return; // Skip on server side
    const stored = localStorage.getItem('groningen_notification_preferences');
    if (stored) {
      try {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }

  // Update preferences
  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
  }

  // Get current preferences
  getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  // Get monitoring status
  isMonitoring(): boolean {
    return this.monitoringInterval !== null;
  }

  // Get last check time
  getLastCheckTime(): number {
    return this.lastCheckTime;
  }
}

// Singleton instance - only create on client side
export const notificationService = typeof window !== 'undefined' ? new NotificationService() : null;
