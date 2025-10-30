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

  const handleDemoFarmer = async (phone: string) => {
    setPhoneNumber(phone)
    setVerificationCode("123456") // Demo verification code
    setIsLoading(true)
    
    try {
      // Authenticate with backend API
      const response = await fetch(`http://localhost:8000/api/v1/farmer/login?phone_number=${encodeURIComponent(phone)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Store session token and farmer info
          localStorage.setItem('sessionToken', data.session_token)
          localStorage.setItem('farmerProfile', JSON.stringify(data.farmer))
          localStorage.setItem('farmerPhone', phone)
          
          setIsLoading(false)
          router.push("/dashboard")
        } else {
          throw new Error('Authentication failed')
        }
      } else {
        throw new Error('Backend authentication failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      // Fallback to demo data if backend is unavailable
      const farmerInfo = {
        name: phone === '+254115568694' ? 'Test Farmer' : 'Test2',
        phone: phone,
        location: phone === '+254115568694' ? 'Nairobi County' : 'Loresho KARLO',
        language: phone === '+254115568694' ? 'en' : 'kik'
      }
      localStorage.setItem('farmerProfile', JSON.stringify(farmerInfo))
      localStorage.setItem('farmerPhone', phone)
      
      setIsLoading(false)
      router.push("/dashboard")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber && verificationCode) {
      setIsLoading(true)
      
      try {
        // First send verification code
        const verifyResponse = await fetch(`http://localhost:8000/api/v1/farmer/send-verification?phone_number=${encodeURIComponent(phoneNumber)}`, {
          method: 'POST',
        })
        
        if (verifyResponse.ok) {
          // Then verify the code
          const loginResponse = await fetch(`http://localhost:8000/api/v1/farmer/verify-code?phone_number=${encodeURIComponent(phoneNumber)}&code=${verificationCode}`, {
            method: 'POST',
          })
          
          if (loginResponse.ok) {
            const data = await loginResponse.json()
            if (data.success) {
              // Store session token and farmer info
              localStorage.setItem('sessionToken', data.session_token)
              localStorage.setItem('farmerProfile', JSON.stringify(data.farmer))
              localStorage.setItem('farmerPhone', phoneNumber)
              
              setIsLoading(false)
              router.push("/dashboard")
            } else {
              throw new Error('Verification failed')
            }
          } else {
            throw new Error('Code verification failed')
          }
        } else {
          throw new Error('Could not send verification code')
        }
      } catch (error) {
        console.error('Login error:', error)
        setIsLoading(false)
        // You could show an error message to the user here
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-2xl relative rounded-3xl shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold text-gray-700">🌱 Opening your farm...</p>
            </div>
          </div>
        )}
        <CardHeader className="text-center space-y-6 pt-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Sprout className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              MavunoAI Credit
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              🛰️ Satellite-Powered Farming Finance
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          {/* Visual Farmer Selection */}
          <div>
            <h3 className="text-xl font-bold text-center mb-6">👤 Choose Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mary - Onion Farmer */}
              <button
                onClick={() => handleDemoFarmer("+254712345678")}
                disabled={isLoading}
                className="group relative bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-2 border-orange-200 rounded-2xl p-6 transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                <div className="text-6xl mb-3">🧅</div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Mary Wanjiru</h4>
                <p className="text-sm text-gray-600 mb-2">Onion Farmer • Nakuru</p>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <span className="text-2xl">⭐</span>
                  <span>High Score (82%)</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">+254712345678</div>
              </button>

              {/* John - Maize Farmer */}
              <button
                onClick={() => handleDemoFarmer("+254723456789")}
                disabled={isLoading}
                className="group relative bg-gradient-to-br from-yellow-50 to-green-50 hover:from-yellow-100 hover:to-green-100 border-2 border-green-200 rounded-2xl p-6 transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                <div className="text-6xl mb-3">🌽</div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">John Kamau</h4>
                <p className="text-sm text-gray-600 mb-2">Maize Farmer • Machakos</p>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                  <span className="text-2xl">⭐</span>
                  <span>Medium Score (65%)</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">+254723456789</div>
              </button>

              {/* Grace - Beekeeper */}
              <button
                onClick={() => handleDemoFarmer("+254734567890")}
                disabled={isLoading}
                className="group relative bg-gradient-to-br from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-amber-200 rounded-2xl p-6 transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                <div className="text-6xl mb-3">🐝</div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Grace Njeri</h4>
                <p className="text-sm text-gray-600 mb-2">Beekeeper • Kiambu</p>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <span className="text-2xl">⭐</span>
                  <span>High Score (85%)</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">+254734567890</div>
              </button>

              {/* New User */}
              <button
                onClick={() => handleDemoFarmer("+254700000000")}
                disabled={isLoading}
                className="group relative bg-gradient-to-br from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 border-2 border-blue-200 border-dashed rounded-2xl p-6 transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                <div className="text-6xl mb-3">➕</div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">New Farmer</h4>
                <p className="text-sm text-gray-600 mb-2">Register & Get Score</p>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                  <span className="text-2xl">🆕</span>
                  <span>Start Your Journey</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">+254700000000</div>
              </button>
            </div>
          </div>

          {/* Quick Access Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/credit">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg rounded-2xl shadow-lg">
                💳 Credit Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-6 text-lg rounded-2xl">
                🌱 Farm Dashboard
              </Button>
            </Link>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">🛰️ Powered by NASA Satellites</span>
              <br />
              Real-time soil moisture, rainfall & vegetation data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
