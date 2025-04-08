"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NavBar from "@/components/nav-bar"
import Link from "next/link"
import { Gift, History, Heart, Settings } from "lucide-react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentRecommendations, setRecentRecommendations] = useState([])
  const [savedGifts, setSavedGifts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      // Load saved gifts from localStorage
      const loadSavedGifts = () => {
        const saved = localStorage.getItem("savedGifts")
        if (saved) {
          try {
            setSavedGifts(JSON.parse(saved))
          } catch (e) {
            console.error("Error loading saved gifts:", e)
          }
        }
      }

      loadSavedGifts()
      setLoading(false)
    }
  }, [status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user?.name}</h1>
          <p className="text-muted-foreground">
            Manage your gift recommendations and saved items from your personal dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-primary" />
                Find Gifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Start a new gift recommendation survey</p>
              <Button asChild className="w-full">
                <Link href="/survey">Start Survey</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Saved Gifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {savedGifts.length} gift{savedGifts.length !== 1 ? "s" : ""} saved
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/saved-gifts">View Saved</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5 text-primary" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">View your recommendation history</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/history">View History</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage your account settings</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Recommendations</CardTitle>
              <CardDescription>Your latest gift recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {savedGifts.length > 0 ? (
                <ul className="space-y-2">
                  {savedGifts.slice(0, 5).map((gift: any) => (
                    <li key={gift.id} className="border-b pb-2">
                      <Link href={`/gift/${gift.id}`} className="hover:underline">
                        {gift.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        ${gift.price.toFixed(2)} - {gift.category}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No recommendations yet</p>
                  <Button asChild>
                    <Link href="/survey">Get Recommendations</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Make the most of your gift recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="pb-2 border-b">
                  <p className="font-medium">Be specific in your survey</p>
                  <p className="text-sm text-muted-foreground">
                    The more details you provide, the better your recommendations will be.
                  </p>
                </li>
                <li className="pb-2 border-b">
                  <p className="font-medium">Save gifts you like</p>
                  <p className="text-sm text-muted-foreground">
                    Click the bookmark icon to save gifts for later reference.
                  </p>
                </li>
                <li className="pb-2 border-b">
                  <p className="font-medium">Use filters</p>
                  <p className="text-sm text-muted-foreground">
                    Narrow down recommendations by price, category, and more.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Check the "Why?" section</p>
                  <p className="text-sm text-muted-foreground">
                    Each gift includes an explanation of why it was recommended.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

