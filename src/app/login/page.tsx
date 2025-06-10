"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Home as HomeIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, login } = useAuth();

  // Get redirect URL from search params
  const redirectUrl = searchParams.get('redirect') || '/properties';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect admin users to admin dashboard, others to properties or specified redirect
      const finalRedirect = user.role === 'admin' ? '/admin' : redirectUrl;
      router.push(finalRedirect);
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  // Demo credentials
  const demoCredentials = {
    email: "demo@groningenrentals.com",
    password: "demo2025"
  };

  const adminCredentials = {
    email: "admin@groningenrentals.com",
    password: "admin2025"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);

      if (success) {
        // Check if redirect parameter exists in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect');

        if (redirectPath) {
          router.push(redirectPath);
        } else {
          // Default redirect based on email/role
          const defaultPath = email === adminCredentials.email ? "/admin" : "/properties";
          router.push(defaultPath);
        }
      } else {
        setError("Invalid email or password. Use the demo or admin credentials below.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred during login. Please try again.");
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

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
                <p className="text-sm text-muted-foreground">Member Login</p>
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

      {/* Login Form */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              🔐 Premium Access
            </Badge>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Access exclusive rental listings and premium features
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In to Your Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 border-t pt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Demo Access</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Use these credentials to explore the platform:
                  </p>
                  <div className="space-y-1 text-sm font-mono bg-white rounded p-2 border">
                    <div><strong>Email:</strong> {demoCredentials.email}</div>
                    <div><strong>Password:</strong> {demoCredentials.password}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={fillDemoCredentials}
                    type="button"
                  >
                    Fill Demo Credentials
                  </Button>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-900">Admin Access</span>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">
                    Admin dashboard access for system monitoring:
                  </p>
                  <div className="space-y-1 text-sm font-mono bg-white rounded p-2 border">
                    <div><strong>Email:</strong> {adminCredentials.email}</div>
                    <div><strong>Password:</strong> {adminCredentials.password}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => {
                      setEmail(adminCredentials.email);
                      setPassword(adminCredentials.password);
                    }}
                    type="button"
                  >
                    Fill Admin Credentials
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/waitlist" className="text-primary hover:underline">
                    Join the waitlist
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 text-center">
            <h3 className="font-semibold mb-3">What you'll get access to:</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                165+ verified property listings
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Real-time updates from 6 major platforms
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Direct links to original listings
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Advanced search and filtering
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>}>
      <LoginForm />
    </Suspense>
  );
}
