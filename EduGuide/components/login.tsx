"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, ShieldAlert } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"

export function LoginComponent() {
  const { login } = useAnalysis()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const success = await login()
      if (!success) {
        setError("Sign-in was cancelled or failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred during authentication.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-6 relative z-10 fade-in-up">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gradient">EduGuide AI</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Academic Performance Analysis & Career Mapping Engine
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="glass-effect neon-glow border-primary/15">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your AI-powered academic workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 shadow-sm relative flex items-center justify-center gap-3 transition-all duration-200 mt-2 font-medium"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-neutral-900 animate-ping" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                      <path d="M12,20.62c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.07,0.98 -3.3,0.98 -2.34,0 -4.33,-1.58 -5.03,-3.7H2.94v2.66C4.43,18.77 7.95,20.62 12,20.62z" fill="#34A853" />
                      <path d="M6.97,13.15c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V7.09H2.94c-0.6,1.21 -0.94,2.57 -0.94,4.01s0.34,2.8 0.94,4.01L6.97,13.15z" fill="#FBBC05" />
                      <path d="M12,6.08c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.37 14.42,2.62 12,2.62c-4.05,0 -7.57,1.85 -9.06,4.47l4.03,3.13C7.67,7.66 9.66,6.08 12,6.08z" fill="#EA4335" />
                    </g>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

