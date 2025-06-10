"use client";

import { useState, useEffect } from "react";
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
  Database
} from "lucide-react";

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
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
            <Button onClick={fetchStats} disabled={loading}>
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
