"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Home as HomeIcon,
  Users,
  Clock,
  Shield,
  CheckCircle,
  Mail,
  Calendar,
  TrendingUp,
  Star
} from "lucide-react";
import Link from "next/link";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Simulate current waitlist stats
  const waitlistStats = {
    currentPosition: Math.floor(Math.random() * 150) + 1,
    totalWaiting: 547,
    nextRelease: "January 15th"
  };

  const features = [
    {
      icon: Shield,
      title: "Pre-Market Access",
      description: "See new listings 24-48 hours before they go public on other platforms"
    },
    {
      icon: TrendingUp,
      title: "Price Alerts",
      description: "Get notified instantly when properties in your budget become available"
    },
    {
      icon: Users,
      title: "Priority Support",
      description: "Direct line to real estate agents with faster response times"
    },
    {
      icon: Calendar,
      title: "Auto-Scheduling",
      description: "Automatically schedule viewings based on your calendar availability"
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HomeIcon className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">GroningenRentals</h1>
                  <p className="text-sm text-muted-foreground">Join the Waitlist</p>
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

        {/* Success Message */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">You're on the list! 🎉</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Welcome to GroningenRentals early access. We'll notify you as soon as your spot opens up.
              </p>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Your Waitlist Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">#{waitlistStats.currentPosition}</div>
                    <div className="text-sm text-muted-foreground">Your Position</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{waitlistStats.totalWaiting}</div>
                    <div className="text-sm text-muted-foreground">Total Waiting</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-green-600">{waitlistStats.nextRelease}</div>
                    <div className="text-sm text-muted-foreground">Next Release</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold mb-2">💡 What happens next?</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• We'll email you when your access is ready (usually within 2-3 weeks)</li>
                    <li>• You'll get 30 days of full platform access</li>
                    <li>• Early users help shape new features</li>
                    <li>• Referrals can move you up the list faster</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <p className="text-sm text-muted-foreground">
                Questions? Email us at{" "}
                <a href="mailto:hello@groningenrentals.com" className="text-primary hover:underline">
                  hello@groningenrentals.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">GroningenRentals</h1>
                <p className="text-sm text-muted-foreground">Join the Waitlist</p>
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

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 via-primary/2 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Early Access Program
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join the{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Exclusive
              </span>{" "}
              Waitlist
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're currently in private beta, carefully onboarding{" "}
              <span className="font-semibold text-foreground">50 new users every month</span> to ensure
              the best possible experience.
            </p>

            {/* Waitlist Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50</div>
                <div className="text-sm text-muted-foreground">Users per month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">24-48h</div>
                <div className="text-sm text-muted-foreground">Early access to listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">97%</div>
                <div className="text-sm text-muted-foreground">Success rate</div>
              </div>
            </div>

            {/* Waitlist Form */}
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Reserve Your Spot</CardTitle>
                <p className="text-center text-muted-foreground">
                  Get notified when we have space for you
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Join Waitlist
                      </>
                    )}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Waitlist Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why the exclusive access?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're building the ultimate rental platform. Quality over quantity means better results for our users.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Quality Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By limiting our user base, we can personally verify every listing and maintain
                    the highest quality standards. No fake listings, no outdated information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Personal Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every user gets dedicated support from our team. We help you navigate
                    the Groningen rental market and connect directly with trusted agents.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Premium Features */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-6">What you get with early access</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-8">Trusted by Groningen students & professionals</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    "Found my perfect studio in Centrum within 3 days. The early access made all the difference."
                  </p>
                  <div className="text-sm font-medium">Sarah M., RUG Student</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    "The price alerts saved me hundreds of euros. Caught a great deal in Paddepoel before it was public."
                  </p>
                  <div className="text-sm font-medium">Mark V., Professional</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    "Personal support was amazing. They helped me understand the Dutch rental process completely."
                  </p>
                  <div className="text-sm font-medium">Anna L., International Student</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
