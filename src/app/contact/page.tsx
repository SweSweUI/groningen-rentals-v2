"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Phone, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    moveInDate: "",
    visitPreference: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the property owner
    alert("Message sent! The property owner will contact you soon.");
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      moveInDate: "",
      visitPreference: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Listings
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Contact Property Owner</h1>
              <p className="text-sm text-muted-foreground">Modern 2-bedroom apartment in Centrum</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name *</label>
                    <Input
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+31 6 12345678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Preferred Move-in Date</label>
                  <Input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => handleInputChange("moveInDate", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Viewing Preference</label>
                  <Select value={formData.visitPreference} onValueChange={(value) => handleInputChange("visitPreference", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When would you like to visit?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="weekday">Weekday evenings</SelectItem>
                      <SelectItem value="weekend">Weekend</SelectItem>
                      <SelectItem value="flexible">I'm flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message *</label>
                  <textarea
                    className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Tell the property owner about yourself, your situation, and why you're interested in this property..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Property Details & Contact Info */}
          <div className="space-y-6">
            {/* Property Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop"
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">Modern 2-bedroom apartment in Centrum</h3>
                  <p className="text-sm text-muted-foreground">Groningen Centrum • 75m² • 2 rooms</p>
                  <p className="text-lg font-bold mt-2">€1,200 /month</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Beautiful apartment in the heart of Groningen with modern amenities, close to shops and restaurants.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Alternative Contact Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Direct</p>
                    <p className="text-sm text-muted-foreground">contact@pararius.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Call Property Owner</p>
                    <p className="text-sm text-muted-foreground">+31 50 123 4567</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://pararius.com" target="_blank" rel="noopener noreferrer">
                      View Original Listing on Pararius
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Response Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Be specific about your move-in timeline</li>
                  <li>• Mention your income or employment status</li>
                  <li>• Explain why you're interested in this specific property</li>
                  <li>• Ask relevant questions about the property or neighborhood</li>
                  <li>• Be professional and polite in your communication</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
