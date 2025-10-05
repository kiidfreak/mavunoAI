import { EntityHeader } from "@/components/entity/entity-header"
import { NetworkOverview } from "@/components/entity/network-overview"
import { RegionalMap } from "@/components/entity/regional-map"
import { FarmerTable } from "@/components/entity/farmer-table"
import { ImpactMetrics } from "@/components/entity/impact-metrics"
import { AlertsOverview } from "@/components/entity/alerts-overview"

export default function EntityDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <EntityHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <NetworkOverview />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RegionalMap />
            <FarmerTable />
          </div>
          <div className="space-y-6">
            <AlertsOverview />
            <ImpactMetrics />
          </div>
        </div>
      </main>
    </div>
  )
}
