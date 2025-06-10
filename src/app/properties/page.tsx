"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Heart, MapPin, Home as HomeIcon, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { allProperties, type Property } from "@/lib/api";
import { scrapeAllRealProperties } from "@/lib/real-property-scraper";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

const formatDaysAgo = (days: number) => {
  if (days === 0) return "Listed today";
  if (days === 1) return "Listed 1 day ago";
  return `Listed ${days} days ago`;
};

const getSourceColor = (source: string) => {
  switch (source) {
    case "Gruno Verhuur": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Van der Meulen Makelaars": return "bg-green-100 text-green-800 border-green-200";
    case "Rotsvast Groningen": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Nova Vastgoed": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const PropertyImage = ({ src, alt, title }: { src: string; alt: string; title: string }) => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="relative w-full h-48">
      {imageLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-48 object-cover transition-opacity ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        title={title}
      />
    </div>
  );
};

function PropertiesPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Initial load and 5-minute refresh cycle
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log('🚀 Loading property data with real images...');
        const realProperties = await scrapeAllRealProperties();
        setProperties(realProperties);
        setLastUpdated(new Date());
        console.log(`✅ Loaded ${realProperties.length} properties with real images`);
      } catch (error) {
        console.error('❌ Error loading properties:', error);
        // Fallback to existing data
        setProperties(allProperties);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Set up 10-minute refresh interval for real data
    const interval = setInterval(async () => {
      try {
        console.log('🔄 Refreshing real property data...');
        const refreshedProperties = await scrapeAllRealProperties();
        setProperties(refreshedProperties);
        setLastUpdated(new Date());
        console.log(`✨ Refreshed ${refreshedProperties.length} properties`);
      } catch (error) {
        console.error('❌ Error refreshing properties:', error);
      }
    }, 600000); // 10 minutes = 600,000ms

    return () => clearInterval(interval);
  }, []);

  // Parse URL params for pre-filtering
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type) {
      setTypeFilter(type);
    }
  }, []);

  // Filter properties based on search criteria
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Skip price filtering for "Price on request" properties (price = 0)
    const matchesPrice = !priceFilter || property.price === 0 || (
      priceFilter === "under-500" && property.price < 500 ||
      priceFilter === "500-1000" && property.price >= 500 && property.price <= 1000 ||
      priceFilter === "1000-1500" && property.price >= 1000 && property.price <= 1500 ||
      priceFilter === "over-1500" && property.price > 1500
    );

    const matchesType = !typeFilter || property.type === typeFilter;
    const matchesLocation = !locationFilter || property.location.includes(locationFilter);

    return matchesSearch && matchesPrice && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <HomeIcon className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">All Properties</h1>
                  <p className="text-sm text-muted-foreground">
                    Searching {properties.length} properties from 4 sources
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
              )}
              <Button variant="outline" asChild>
                <Link href="/sources">
                  View Sources
                </Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-500">Under €500</SelectItem>
                <SelectItem value="500-1000">€500 - €1000</SelectItem>
                <SelectItem value="1000-1500">€1000 - €1500</SelectItem>
                <SelectItem value="over-1500">Over €1500</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Room">Room</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Centrum">Centrum</SelectItem>
                <SelectItem value="Noord">Noord</SelectItem>
                <SelectItem value="Zuid">Zuid</SelectItem>
                <SelectItem value="Oost">Oost</SelectItem>
                <SelectItem value="West">West</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || priceFilter || typeFilter || locationFilter) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                  </Badge>
                )}
                {priceFilter && (
                  <Badge variant="secondary">
                    Price: {priceFilter}
                  </Badge>
                )}
                {typeFilter && (
                  <Badge variant="secondary">
                    Type: {typeFilter}
                  </Badge>
                )}
                {locationFilter && (
                  <Badge variant="secondary">
                    Area: {locationFilter}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setPriceFilter("");
                  setTypeFilter("");
                  setLocationFilter("");
                }}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {loading ? "Loading properties..." : `${filteredProperties.length} properties found`}
          </h2>
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                Loading from all sources...
              </span>
            ) : (
              <>Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString([], {hour12: false}) : '--:--:--'}</>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={`loading-${i}`} className="overflow-hidden">
                <div className="w-full h-48 bg-muted animate-pulse" />
                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="h-3 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm"
              onClick={() => window.open(property.sourceUrl, '_blank')}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium tracking-wide"
                  >
                    {property.source}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {(property.daysAgo || property.listedDays) === 0 && (
                      <Badge className="bg-emerald-500 text-white text-xs font-medium animate-pulse">
                        Just Listed
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-white/80 hover:bg-white rounded-full shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic here
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2">
                  {property.title}
                </CardTitle>

                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{property.location}</span>
                </div>

                {property.realEstateAgent && (
                  <div className="text-xs text-gray-500 font-medium">
                    via {property.realEstateAgent}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price Section */}
                <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {property.price === 0 ? "Price on request" : `€${property.price.toLocaleString()}`}
                  </div>
                  {property.price > 0 && (
                    <div className="text-sm text-gray-600 font-medium">per month</div>
                  )}
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{property.size}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Size</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{property.rooms}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Rooms</div>
                  </div>
                </div>

                {/* Property Info */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {property.type}
                    </span>
                    <span className="text-emerald-600 font-medium">
                      {property.available}
                    </span>
                  </div>

                  {property.interior && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Interior:</span> {property.interior}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    {/* Robust listing date display */}
                    {typeof property.daysAgo === 'number' && property.daysAgo >= 0
                      ? formatDaysAgo(property.daysAgo)
                      : property.listedDate
                        ? `Listed on ${property.listedDate}`
                        : 'Listing date unknown'}
                  </div>
                </div>

                {/* Action Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span className="text-sm font-medium mr-2">View full details on {property.source}</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <HomeIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or clear filters to see more results.
            </p>
            <Button asChild>
              <Link href="/properties">
                View All Properties
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <ProtectedRoute>
      <PropertiesPageContent />
    </ProtectedRoute>
  );
}
