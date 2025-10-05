"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sprout } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDemoFarmer = (phone: string) => {
    setPhoneNumber(phone)
    setVerificationCode("123456") // Demo verification code
    setIsLoading(true)
    
    // Store farmer info in localStorage
    const farmerInfo = {
      name: phone === '+254115568694' ? 'Test Farmer' : 'Test2',
      phone: phone,
      location: phone === '+254115568694' ? 'Nairobi County' : 'Loresho KARLO',
      language: phone === '+254115568694' ? 'en' : 'kik'
    }
    localStorage.setItem('farmerProfile', JSON.stringify(farmerInfo))
    localStorage.setItem('farmerPhone', phone)
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber && verificationCode) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard")
      }, 1500)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <Card className="w-full max-w-md relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Logging in...</p>
            </div>
          </div>
        )}
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">🌱 Farmer Login</CardTitle>
            <CardDescription>Access your sustainable farming dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+254 XXX XXX XXX" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification">Verification Code</Label>
              <Input 
                id="verification" 
                placeholder="Enter SMS code" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll send you a verification code via SMS
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={!phoneNumber || !verificationCode || isLoading}
              >
                {isLoading ? "🌱 Logging in..." : "🌱 Access My Farm Dashboard"}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Demo Farmers:</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => handleDemoFarmer("+254115568694")}
                    disabled={isLoading}
                  >
                    {isLoading && phoneNumber === "+254115568694" ? "Loading..." : "🧅 Test Farmer (Onions) - +254115568694"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => handleDemoFarmer("+254111548797")}
                    disabled={isLoading}
                  >
                    {isLoading && phoneNumber === "+254111548797" ? "Loading..." : "🐝 Test2 (Apiary) - +254111548797"}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full bg-transparent">
              WhatsApp
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              USSD
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/dashboard" className="text-primary hover:underline font-medium">
              Start Free Trial
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
