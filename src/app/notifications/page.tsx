"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import {
  Bell,
  Mail,
  Settings,
  Check,
  Home as HomeIcon,
  ArrowLeft,
  Star,
  Filter,
  MapPin,
  Euro,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NotificationsPage() {
  const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [preferences, setPreferences] = useState({
    minPrice: '',
    maxPrice: '',
    propertyTypes: [] as string[],
    areas: [] as string[]
  });

  const propertyTypes = ['Studio', 'Apartment', 'House', 'Room'];
  const areas = ['Centrum', 'Noord', 'Zuid', 'Oost', 'West', 'Paddepoel', 'Zernike', 'Helpman'];

  const handleSubscribe = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences: {
            minPrice: preferences.minPrice ? Number.parseInt(preferences.minPrice) : undefined,
            maxPrice: preferences.maxPrice ? Number.parseInt(preferences.maxPrice) : undefined,
            propertyTypes: preferences.propertyTypes.length > 0 ? preferences.propertyTypes : undefined,
            areas: preferences.areas.length > 0 ? preferences.areas : undefined,
          }
        }),
      });

      if (response.ok) {
        setSubscribed(true);
        toast.success('Successfully subscribed to property notifications!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePropertyType = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const toggleArea = (area: string) => {
    setPreferences(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Email Notifications</h1>
                  <p className="text-sm text-muted-foreground">Get alerted when new properties match your criteria</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Badge variant="secondary" className="px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  {user?.name}
                </Badge>
              )}
              <Button variant="outline" asChild>
                <Link href="/properties">
                  Browse Properties
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {subscribed ? (
            // Success state
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-green-800">You're All Set!</CardTitle>
                <p className="text-green-700">
                  You'll receive email notifications whenever new properties match your preferences.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">Your Notification Preferences</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price Range:</span>
                        <p className="font-medium">
                          {preferences.minPrice || preferences.maxPrice ?
                            `€${preferences.minPrice || '0'} - €${preferences.maxPrice || '∞'}` :
                            'Any price'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Property Types:</span>
                        <p className="font-medium">
                          {preferences.propertyTypes.length > 0 ? preferences.propertyTypes.join(', ') : 'All types'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Areas:</span>
                        <p className="font-medium">
                          {preferences.areas.length > 0 ? preferences.areas.join(', ') : 'All areas'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => setSubscribed(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Update Preferences
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/properties">
                        <HomeIcon className="h-4 w-4 mr-2" />
                        Browse Properties
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Subscription form
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-6 w-6 text-primary" />
                    <span>Get Instant Property Alerts</span>
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Our system checks all 9 real estate agencies every 10 minutes. Be the first to know when properties matching your criteria become available!
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="flex items-center space-x-2">
                      <Euro className="h-4 w-4" />
                      <span>Price Range (Optional)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input
                          placeholder="Min price (€)"
                          value={preferences.minPrice}
                          onChange={(e) => setPreferences(prev => ({...prev, minPrice: e.target.value}))}
                          type="number"
                          min="0"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Max price (€)"
                          value={preferences.maxPrice}
                          onChange={(e) => setPreferences(prev => ({...prev, maxPrice: e.target.value}))}
                          type="number"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Types */}
                  <div className="space-y-3">
                    <Label className="flex items-center space-x-2">
                      <HomeIcon className="h-4 w-4" />
                      <span>Property Types (Optional)</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map(type => (
                        <Badge
                          key={type}
                          variant={preferences.propertyTypes.includes(type) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => togglePropertyType(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Leave empty to receive alerts for all property types
                    </p>
                  </div>

                  {/* Areas */}
                  <div className="space-y-3">
                    <Label className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Preferred Areas (Optional)</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {areas.map(area => (
                        <Badge
                          key={area}
                          variant={preferences.areas.includes(area) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleArea(area)}
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Leave empty to receive alerts for all areas in Groningen
                    </p>
                  </div>

                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4 mr-2" />
                        Subscribe to Notifications
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-1">Real-Time Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified within 10 minutes of new listings
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-4">
                    <Filter className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-1">Smart Filtering</h3>
                    <p className="text-sm text-muted-foreground">
                      Only receive properties that match your criteria
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-4">
                    <HomeIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-1">9 Agencies</h3>
                    <p className="text-sm text-muted-foreground">
                      All top Groningen real estate agencies covered
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
