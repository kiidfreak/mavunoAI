import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Video, Mail, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

const experts = [
  {
    name: "Dr. James Kamau",
    specialty: "Irrigation & Water Management",
    available: true,
    phone: "+254 712 345 678",
    email: "j.kamau@mavunoai.com",
  },
  {
    name: "Mary Wanjiku",
    specialty: "Crop Health & Pest Management",
    available: true,
    phone: "+254 723 456 789",
    email: "m.wanjiku@mavunoai.com",
  },
  {
    name: "Peter Omondi",
    specialty: "Dairy Farming & Pasture",
    available: false,
    phone: "+254 734 567 890",
    email: "p.omondi@mavunoai.com",
  },
]

export default function ExpertPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Call an Expert</h1>
            <p className="text-muted-foreground">Get personalized advice from agricultural specialists</p>
          </div>
        </div>

        <div className="grid gap-6">
          {experts.map((expert, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{expert.name}</CardTitle>
                    <CardDescription>{expert.specialty}</CardDescription>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      expert.available ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {expert.available ? "Available Now" : "Offline"}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="default" className="gap-2" disabled={!expert.available}>
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent" disabled={!expert.available}>
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent" disabled={!expert.available}>
                    <Video className="w-4 h-4" />
                    Video
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent" asChild>
                    <a href={`mailto:${expert.email}`}>
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  </Button>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Phone: {expert.phone}</p>
                  <p>Email: {expert.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
