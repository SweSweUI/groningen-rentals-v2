"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  Mail,
  Server,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import ScraperStatusMonitor from '@/components/ScraperStatusMonitor';

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

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-4">Please log in to access the admin dashboard.</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

              {/* Add Scraper Status Monitor */}
              <div className="mb-8">
                <ScraperStatusMonitor />
              </div>

              {/* Existing Dashboard Component */}
              <AdminDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastRefresh(new Date());
      } else if (response.status === 403) {
        console.error('Access denied to admin stats');
      } else {
        console.error('Failed to fetch admin stats:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentProperties = async () => {
    try {
      const response = await fetch('/api/scrape-properties');
      if (response.ok) {
        const data = await response.json();
        setRecentProperties(data.properties?.slice(0, 10) || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent properties:', error);
    }
  };

  const manualScrape = async () => {
    try {
      setScraping(true);
      console.log('🔄 Manual scrape initiated...');

      const response = await fetch('/api/scrape-properties', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Manual scrape completed:', data.count, 'properties');

        // Refresh stats and properties
        await Promise.all([fetchStats(), fetchRecentProperties()]);

        // Show success message
        alert(`✅ Scrape completed! Found ${data.count} properties from ${data.sources?.length || 0} agencies.`);
      } else {
        console.error('❌ Manual scrape failed:', response.statusText);
        alert('❌ Scrape failed. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Manual scrape error:', error);
      alert('❌ Scrape error. Check console for details.');
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentProperties();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchRecentProperties();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString: string) => {
    if (isoString === 'Never') return 'Never';
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getTimeUntilNext = (nextRun: string) => {
    if (nextRun === 'Never') return 'Not scheduled';
    try {
      const next = new Date(nextRun);
      const now = new Date();
      const diff = next.getTime() - now.getTime();

      if (diff <= 0) return 'Overdue';

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      return `${minutes}m ${seconds}s`;
    } catch {
      return 'Unknown';
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              GroningenRentals System Monitoring
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </Badge>
            <Button onClick={manualScrape} disabled={scraping} variant="default">
              <Activity className={`h-4 w-4 mr-2 ${scraping ? 'animate-spin' : ''}`} />
              {scraping ? 'Scraping...' : 'Manual Scrape'}
            </Button>
            <Button onClick={() => { fetchStats(); fetchRecentProperties(); }} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Properties */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.scraping.totalProperties}</div>
                <p className="text-xs text-muted-foreground">
                  From {Object.keys(stats.scraping.propertiesByAgency).length} agencies
                </p>
              </CardContent>
            </Card>

            {/* Subscribers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.notifications.totalSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.notifications.emailsSentToday} emails sent today
                </p>
              </CardContent>
            </Card>

            {/* Success Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.scraping.successRate)}%</div>
                <p className="text-xs text-muted-foreground">
                  Scraping reliability
                </p>
              </CardContent>
            </Card>

            {/* System Uptime */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.system.uptime}</div>
                <p className="text-xs text-muted-foreground">
                  Memory: {stats.system.memoryUsage}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scraping Status */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Scraping Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Run:</span>
                  <span className="text-sm">{formatTime(stats.scraping.lastRun)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Next Run:</span>
                  <Badge variant="outline">
                    {getTimeUntilNext(stats.scraping.nextRun)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Properties by Agency:</span>
                  {Object.entries(stats.scraping.propertiesByAgency).map(([agency, count]) => (
                    <div key={agency} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{agency}:</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Errors */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Recent Errors
                  {stats.scraping.errors.length === 0 && (
                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.scraping.errors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent errors</p>
                ) : (
                  <div className="space-y-2">
                    {stats.scraping.errors.map((error, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 rounded text-red-700">
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notification Status */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Subscribers:</span>
                  <Badge variant="outline">{stats.notifications.totalSubscribers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Emails Sent Today:</span>
                  <Badge variant="outline">{stats.notifications.emailsSentToday}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Notification:</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(stats.notifications.lastNotificationSent)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Info */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cache Hit Rate:</span>
                  <Badge variant="outline">{stats.system.cacheHitRate}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memory Usage:</span>
                  <span className="text-sm">{stats.system.memoryUsage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Scraping Frequency:</span>
                  <Badge variant="outline">Every 30 minutes</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Properties Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Recent Properties ({recentProperties.length})
                <Badge variant="secondary" className="ml-2">
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentProperties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No properties loaded yet. Click "Manual Scrape" to fetch data.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProperties.map((property, index) => (
                    <div
                      key={property.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {property.agent || property.source || 'Unknown'}
                          </Badge>
                          <div className="font-medium text-sm">
                            {property.title || 'Untitled Property'}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {property.location} • {property.size} • {property.rooms} rooms
                          {property.daysAgo !== undefined && (
                            <span className="ml-2">
                              • Listed {property.daysAgo === 0 ? 'today' : `${property.daysAgo} days ago`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            €{property.price?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground">per month</div>
                        </div>
                        {property.sourceUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(property.sourceUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {recentProperties.length >= 10 && (
                    <div className="text-center pt-4 border-t">
                      <Button variant="outline" asChild>
                        <Link href="/properties">
                          View All Properties
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
