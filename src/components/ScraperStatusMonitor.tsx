'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AgencyStatus {
  name: string;
  count: number;
  status: 'working' | 'warning' | 'error';
  lastUpdate: string;
  responseTime?: number;
}

interface ScrapingResponse {
  properties: any[];
  count: number;
  timestamp: string;
  sources: string[];
  cached: boolean;
}

export default function ScraperStatusMonitor() {
  const [agencyStats, setAgencyStats] = useState<AgencyStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [totalProperties, setTotalProperties] = useState(0);

  const agencies = [
    'Gruno Verhuur',
    'Van der Meulen Makelaars',
    'Rotsvast Groningen',
    'Nova Vastgoed',
    'DC Wonen',
    '123Wonen',
    'MVGM Wonen',
    'K&P Makelaars',
    'Expat Groningen'
  ];

  const checkScraperStatus = async () => {
    setIsLoading(true);
    console.log('🔍 Checking scraper status...');

    try {
      const startTime = Date.now();
      const response = await fetch('/api/scrape-properties');
      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data: ScrapingResponse = await response.json();
      console.log('📊 Scraper API response:', data);

      // Count properties by agency
      const agencyCounts: { [key: string]: number } = {};

      data.properties.forEach(property => {
        const agency = property.agent || property.source || 'Unknown';
        agencyCounts[agency] = (agencyCounts[agency] || 0) + 1;
      });

      // Create status for each agency
      const stats: AgencyStatus[] = agencies.map(agency => {
        const count = agencyCounts[agency] || 0;
        let status: 'working' | 'warning' | 'error';

        if (count === 0) {
          status = 'error';
        } else if (count < 3) {
          status = 'warning';
        } else {
          status = 'working';
        }

        return {
          name: agency,
          count,
          status,
          lastUpdate: data.timestamp,
          responseTime: responseTime
        };
      });

      setAgencyStats(stats);
      setTotalProperties(data.count);
      setLastChecked(new Date().toLocaleTimeString());

      console.log('✅ Scraper status updated:', stats);

    } catch (error) {
      console.error('❌ Error checking scraper status:', error);

      // Set all agencies to error status
      const errorStats: AgencyStatus[] = agencies.map(agency => ({
        name: agency,
        count: 0,
        status: 'error' as const,
        lastUpdate: 'Error',
        responseTime: undefined
      }));

      setAgencyStats(errorStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check status on mount
    checkScraperStatus();

    // Set up auto-refresh every 2 minutes
    const interval = setInterval(checkScraperStatus, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'working' | 'warning' | 'error') => {
    switch (status) {
      case 'working': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: 'working' | 'warning' | 'error') => {
    switch (status) {
      case 'working': return <Badge className="bg-green-100 text-green-800">✅ Active</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Low Data</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">❌ Error</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const workingCount = agencyStats.filter(a => a.status === 'working').length;
  const warningCount = agencyStats.filter(a => a.status === 'warning').length;
  const errorCount = agencyStats.filter(a => a.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{totalProperties}</div>
            <div className="text-sm text-gray-600">Total Properties</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{workingCount}</div>
            <div className="text-sm text-gray-600">Working Agencies</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-gray-600">Low Data</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>🕷️ Real-Time Scraper Status</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={checkScraperStatus}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? '🔄 Checking...' : '🔍 Check Now'}
            </Button>
            {lastChecked && (
              <span className="text-sm text-gray-500">
                Last checked: {lastChecked}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {agencyStats.map((agency) => (
              <div
                key={agency.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(agency.status)}`} />
                  <div>
                    <div className="font-medium">{agency.name}</div>
                    <div className="text-sm text-gray-600">
                      {agency.count} properties
                      {agency.responseTime && (
                        <span className="ml-2 text-gray-400">
                          ({agency.responseTime}ms)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(agency.status)}
                  <div className="text-sm text-gray-500">
                    {agency.lastUpdate === 'Error' ? 'Error' :
                     new Date(agency.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Console Log Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">
              🔍 View Detailed Logs:
            </div>
            <div className="text-sm text-blue-700">
              Open browser developer tools (F12) → Console tab to see detailed scraping activity,
              timing information, and any errors from individual agencies.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
