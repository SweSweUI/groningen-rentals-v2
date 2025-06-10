"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  Home as HomeIcon,
  Calendar,
  Ruler,
  Users,
  Heart,
  Share2,
  Phone,
  Mail,
  ExternalLink,
  Wifi,
  Car,
  Utensils,
  Bath,
  Building,
  Zap,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import type { Property } from "@/lib/api";
import { findPropertyById } from "@/lib/property-finder";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PropertyImageGallery = ({ property }: { property: Property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : property.image
    ? [property.image]
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-muted flex items-center justify-center rounded-lg">
        <div className="text-center text-muted-foreground">
          <HomeIcon className="h-12 w-12 mx-auto mb-2" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg cursor-pointer"
          onClick={() => setShowGallery(true)}
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} ${index + 1}`}
              className={`h-16 w-full object-cover rounded cursor-pointer transition-opacity ${
                index === currentImageIndex ? 'opacity-100 ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Full Gallery Modal */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{property.title} - Gallery</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ContactForm = ({ property }: { property: Property }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in viewing ${property.title}. Could we schedule a viewing?`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you! Your message has been sent to the real estate agent.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Contact Agent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+31 6 12345678"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Your message..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      try {
        const resolvedParams = await params;
        const foundProperty = await findPropertyById(resolvedParams.id);
        setProperty(foundProperty);
      } catch (error) {
        console.error('Error loading property:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HomeIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Property not found</h1>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to listings
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    'Gym': Building,
    'Pool': Bath,
    'Parking': Car,
    'Kitchen': Utensils,
    'Bathroom': Bath,
    'Internet': Wifi,
    'Balcony': Building,
    'WiFi': Wifi,
    'Washing Machine': Building
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to listings
              </Link>
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <PropertyImageGallery property={property} />

            {/* Property Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                  {property.realEstateAgent && (
                    <p className="text-sm text-muted-foreground">
                      Listed by {property.realEstateAgent}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  {property.source}
                </Badge>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <span className="text-2xl font-bold">
                    {property.price === 0 ? 'Price on request' : `€${property.price}`}
                  </span>
                  {property.price > 0 && (
                    <span className="text-muted-foreground ml-1">/month</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Ruler className="h-5 w-5 mr-2" />
                  <span>{property.size}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{property.rooms} room{property.rooms > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{property.available}</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.fullDescription || property.description}
                </p>
              </div>

              {/* Property Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => {
                      const IconComponent = amenityIcons[feature as keyof typeof amenityIcons] || Building;
                      return (
                        <div key={index} className="flex items-center p-3 bg-muted rounded-lg">
                          <IconComponent className="h-4 w-4 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium">{property.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rooms:</span>
                      <span className="font-medium">{property.rooms}</span>
                    </div>
                    {property.buildYear && (
                      <div className="flex justify-between">
                        <span>Built:</span>
                        <span className="font-medium">{property.buildYear}</span>
                      </div>
                    )}
                    {property.interior && (
                      <div className="flex justify-between">
                        <span>Interior:</span>
                        <span className="font-medium">{property.interior}</span>
                      </div>
                    )}
                    {property.energyLabel && (
                      <div className="flex justify-between">
                        <span>Energy Label:</span>
                        <Badge variant="outline">{property.energyLabel}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span className="font-medium">
                        {property.price === 0 ? 'On request' : `€${property.price}`}
                      </span>
                    </div>
                    {property.deposit && (
                      <div className="flex justify-between">
                        <span>Deposit:</span>
                        <span className="font-medium">€{property.deposit}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Listed:</span>
                      <span className="font-medium">
                        {(property.daysAgo || property.listedDays) === 0 ? 'Today' : `${property.daysAgo || property.listedDays} days ago`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floor Plan */}
              {property.floorPlan && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Floor Plan</h2>
                  <Card>
                    <CardContent className="p-4">
                      <img
                        src={property.floorPlan}
                        alt="Floor plan"
                        className="w-full max-w-md mx-auto rounded-lg"
                      />
                      <Button variant="outline" className="mt-3 w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Floor Plan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Nearby Facilities */}
              {property.nearbyFacilities && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Nearby Facilities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {property.nearbyFacilities.schools && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Schools</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {property.nearbyFacilities.schools.map((school, index) => (
                              <li key={index}>{school}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {property.nearbyFacilities.transport && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Transport</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {property.nearbyFacilities.transport.map((transport, index) => (
                              <li key={index}>{transport}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {property.nearbyFacilities.shopping && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Shopping</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {property.nearbyFacilities.shopping.map((shop, index) => (
                              <li key={index}>{shop}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <ContactForm property={property} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <a href={property.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on {property.source}
                  </a>
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Agent
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Agent
                </Button>
              </CardContent>
            </Card>

            {/* Agent Information */}
            {property.realEstateAgent && (
              <Card>
                <CardHeader>
                  <CardTitle>Real Estate Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {property.realEstateAgent.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{property.realEstateAgent}</p>
                      <p className="text-sm text-muted-foreground">Licensed Agent</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Professional real estate services in Groningen. Contact for viewings and property inquiries.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
