"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import {
  User,
  Mail,
  Settings,
  Check,
  ArrowLeft,
  Star,
  Bell
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AccountPage() {
  const { user, updateEmail, logout } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <p className="text-muted-foreground">Please log in to access your account</p>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Update email in auth context and localStorage
      updateEmail(email);
      toast.success('Email address updated successfully!');

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email address');
    } finally {
      setLoading(false);
    }
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
                <User className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">My Account</h1>
                  <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                {user.role === 'admin' ? 'Admin' : 'Member'}
              </Badge>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-6 w-6 text-primary" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Username</Label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Account Type</Label>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-6 w-6 text-primary" />
                <span>Email Settings</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set your email address to receive notifications about new properties
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <p className="text-xs text-muted-foreground">
                  This email will be used for property notifications and account updates
                </p>
              </div>

              <Button
                onClick={handleSaveEmail}
                disabled={loading || email === user.email}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Email Address
                  </>
                )}
              </Button>

              {user.email && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Email Configured</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Current email: {user.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-6 w-6 text-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how and when you want to receive property alerts
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Property Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new properties match your criteria
                    </p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/notifications">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Link>
                  </Button>
                </div>

                {!user.email && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">Email Required</span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Please set your email address above to receive property notifications
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/properties" className="flex flex-col items-center space-y-2">
                <Settings className="h-6 w-6" />
                <span>Browse Properties</span>
                <span className="text-xs text-muted-foreground">View all available rentals</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/notifications" className="flex flex-col items-center space-y-2">
                <Bell className="h-6 w-6" />
                <span>Notification Settings</span>
                <span className="text-xs text-muted-foreground">Set up property alerts</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
