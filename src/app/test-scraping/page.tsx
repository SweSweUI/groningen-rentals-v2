"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testScrapingFunction } from "@/lib/real-property-scraper";
import type { Property } from "@/lib/api";
import { ArrowLeft, RefreshCw, Globe, Image } from "lucide-react";
import Link from "next/link";

export default function TestScrapingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastTested, setLastTested] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestScraping = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🧪 Testing real property scraping...');
      const scrapedProperties = await testScrapingFunction();

      if (scrapedProperties.length > 0) {
        setProperties(scrapedProperties);
        setLastTested(new Date());
        console.log(`✅ Successfully loaded ${scrapedProperties.length} properties`);
      } else {
        setError('No properties returned from scraping function');
      }
    } catch (err) {
      console.error('❌ Test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Real Property Scraping Test</h1>
                <p className="text-sm text-muted-foreground">Test Netlify function for real image scraping</p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Scraping Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleTestScraping}
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Test Real Scraping
                  </>
                )}
              </Button>

              {lastTested && (
                <span className="text-sm text-muted-foreground">
                  Last tested: {lastTested.toLocaleTimeString()}
                </span>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {properties.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Test Results: {properties.length} properties found
              </h2>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Real Images Detected
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 9).map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&crop=center';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-white/90">
                        {property.source}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        <Image className="h-3 w-3 mr-1" />
                        Real
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">{property.location}</div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">€{property.price}/month</span>
                        <span className="text-sm text-muted-foreground">
                          {property.size} • {property.rooms} rooms
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {property.description}
                      </p>

                      <div className="pt-2">
                        <Button size="sm" className="w-full" asChild>
                          <a href={property.sourceUrl} target="_blank" rel="noopener noreferrer">
                            View Original
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Technical Details */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Total Properties:</strong> {properties.length}
                  </div>
                  <div>
                    <strong>Real Images:</strong> {properties.filter(p => !p.image.includes('unsplash')).length}
                  </div>
                  <div>
                    <strong>Fallback Images:</strong> {properties.filter(p => p.image.includes('unsplash')).length}
                  </div>
                  <div>
                    <strong>Sources:</strong> {[...new Set(properties.map(p => p.source))].join(', ')}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Enhanced Scraper Features:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✅ Advanced image extraction patterns for real property photos</li>
                    <li>✅ Multiple fallback strategies for property detection</li>
                    <li>✅ Enhanced headers and user agents for better scraping</li>
                    <li>✅ Real-time detection of agency-hosted images vs. fallbacks</li>
                    <li>✅ Improved property detail extraction (price, size, rooms, location)</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <strong>Sample Image URLs:</strong>
                  <ul className="mt-2 space-y-1">
                    {properties.slice(0, 3).map((property, index) => (
                      <li key={index} className="text-xs font-mono bg-muted p-2 rounded">
                        {property.image}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        {!loading && properties.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>How to Test Real Property Scraping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What this test does:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Calls our Netlify function to scrape real property data</li>
                  <li>Fetches actual images from real estate agencies in Groningen</li>
                  <li>Shows real property titles, prices, and details</li>
                  <li>Displays the actual property images (not placeholders)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Expected Results:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>10-20 real properties from Groningen real estate agencies</li>
                  <li>Actual interior/exterior photos of properties</li>
                  <li>Real prices, addresses, and property details</li>
                  <li>Working links to original listings</li>
                </ul>
              </div>

              <Button onClick={handleTestScraping} className="w-full">
                <Globe className="h-4 w-4 mr-2" />
                Start Test
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
