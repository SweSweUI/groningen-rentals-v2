"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Users, Building, GraduationCap, Star } from "lucide-react";
import Link from "next/link";

const rentalSources = [
  {
    name: "Gruno Verhuur",
    url: "https://grunoverhuur.nl",
    description: "Leading Groningen rental agency specializing in city center properties with competitive rates and quality service",
    category: "Direct Broker",
    listings: "12+",
    features: ["City center focus", "Competitive rates", "Quality service"],
    rating: 4.7,
    verified: true
  },
  {
    name: "Van der Meulen Makelaars",
    url: "https://vandermeulenmakelaars.nl",
    description: "Established Groningen real estate agency offering rental properties throughout the city with personalized service",
    category: "Direct Broker",
    listings: "10+",
    features: ["Established agency", "City-wide coverage", "Personalized service"],
    rating: 4.6,
    verified: true
  },
  {
    name: "Rotsvast Groningen",
    url: "https://rotsvast.nl",
    description: "National rental specialist with local Groningen office, 34+ years experience in professional property management",
    category: "Direct Broker",
    listings: "8+",
    features: ["National network", "34+ years experience", "Professional management"],
    rating: 4.5,
    verified: true
  },
  {
    name: "Nova Vastgoed",
    url: "https://novavastgoed.com",
    description: "Groningen property management company specializing in rental apartments and rooms throughout the city",
    category: "Direct Broker",
    listings: "6+",
    features: ["Local expertise", "Apartment focus", "Property management"],
    rating: 4.4,
    verified: true
  }
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Listings
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Rental Sources</h1>
                <p className="text-sm text-muted-foreground">
                  All platforms we monitor for Groningen rentals
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalSources.map((source) => (
            <Card key={source.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{source.name}</span>
                  {source.verified && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{source.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {source.listings} listings
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {source.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {source.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    Visit {source.name}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
