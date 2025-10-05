import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { CropHealthMap } from "@/components/dashboard/crop-health-map"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SustainabilityDashboard } from "@/components/dashboard/sustainability-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <DashboardGreeting />
        <OverviewCards />
        <SustainabilityDashboard />
        <CropHealthMap />
        <AlertsPanel />
        <QuickActions />
      </main>
    </div>
  )
}
