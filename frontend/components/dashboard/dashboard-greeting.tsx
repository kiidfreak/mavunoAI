"use client"

import { useEffect, useState } from "react"

interface FarmerProfile {
  name: string;
  phone: string;
  location: string;
  language: string;
}

export function DashboardGreeting() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null)

  useEffect(() => {
    // Set initial time after hydration
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Only run on client side to prevent hydration issues
    if (typeof window === 'undefined') return;
    
    // Get farmer profile from localStorage
    const storedProfile = localStorage.getItem('farmerProfile')
    if (storedProfile) {
      setFarmerProfile(JSON.parse(storedProfile))
    } else {
      // Default fallback
      setFarmerProfile({
        name: 'Test Farmer',
        phone: '+254115568694',
        location: 'Nairobi County',
        language: 'en'
      })
    }
  }, [])

  const getGreeting = () => {
    if (!currentTime) return "Good day"
    const hour = currentTime.getHours()
    const isKikuyu = farmerProfile?.language === 'kik'
    
    if (isKikuyu) {
      if (hour < 12) return "Ũgũ"
      if (hour < 18) return "Ũgũ wa mũthenya"
      return "Ũgũ wa hwaĩ-inĩ"
    }
    
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const formatTime = () => {
    if (!currentTime) return "Loading..."
    return currentTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = () => {
    if (!currentTime) return "Loading..."
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {formatDate()}, {formatTime()}
      </p>
      <h1 className="text-3xl font-bold">
        {getGreeting()}, {farmerProfile?.name || 'Test Farmer'} 👋
      </h1>
      <p className="text-muted-foreground">Here's your farm status for today</p>
    </div>
  )
}
