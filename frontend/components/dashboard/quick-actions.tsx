import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Phone, Hash, Gamepad2 } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    icon: Cloud,
    label: "Check Weather",
    href: "/weather",
  },
  {
    icon: Phone,
    label: "Call Expert",
    href: "/expert",
  },
  {
    icon: Hash,
    label: "USSD Menu",
    href: "/ussd",
  },
  {
    icon: Gamepad2,
    label: "Game Mode",
    href: "/farmsim",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-auto flex-col gap-2 py-6 bg-transparent" asChild>
              <Link href={action.href}>
                <action.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
