"use client";

import { Button } from "@/components/ui/button"
import { Sprout, Bell, Globe } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const [farmerProfile, setFarmerProfile] = useState<any>(null)
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Only run on client side to prevent hydration issues
    if (typeof window === 'undefined') return;
    
    const storedProfile = localStorage.getItem('farmerProfile')
    if (storedProfile) {
      const profile = JSON.parse(storedProfile)
      setFarmerProfile(profile)
      setCurrentLanguage(profile.language)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'kik' : 'en'
    setCurrentLanguage(newLang)
    if (farmerProfile) {
      const updatedProfile = { ...farmerProfile, language: newLang }
      localStorage.setItem('farmerProfile', JSON.stringify(updatedProfile))
      setFarmerProfile(updatedProfile)
    }
  }

  const getLanguageLabel = () => {
    return currentLanguage === 'kik' ? 'Kikuyu' : 'English'
  }
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">MavunoAI</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/farms">
                  My Farms
                  <Badge variant="secondary" className="ml-2">
                    3
                  </Badge>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/advice">
                  Advice
                  <Badge variant="secondary" className="ml-2">
                    2
                  </Badge>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/market">Market</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/nasa-data">
                  NASA Data
                  <Badge variant="default" className="ml-2 bg-primary">
                    Live
                  </Badge>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/farmsim">
                  FarmSim
                  <Badge variant="default" className="ml-2 bg-accent">
                    New
                  </Badge>
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{getLanguageLabel()}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {farmerProfile?.name ? farmerProfile.name.charAt(0) : 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium">{farmerProfile?.name || 'Test Farmer'}</span>
                    <span className="text-xs text-muted-foreground">{farmerProfile?.location || 'Nairobi County'}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{farmerProfile?.name || 'Test Farmer'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Back to Landing Page</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">Help & Support</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/signin">Sign Out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
