"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Gift } from "@/types/gift"
import { Star, ArrowLeft, Bookmark } from "lucide-react"
import Link from "next/link"
import { saveGift, removeGift, isGiftSaved } from "@/lib/gift-utils"
import GiftExplanation from "@/components/gift-explanation"

export default function GiftDetailPage() {
  const params = useParams()
  const [gift, setGift] = useState<Gift | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Fetch gift details from API
    const fetchGift = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/gift/${params.id}`)

        if (response.ok) {
          const data = await response.json()
          setGift(data.gift)

          // Check if this gift is saved
          if (data.gift.id) {
            setSaved(isGiftSaved(data.gift.id))
          }
        } else {
          console.error("Gift not found")
        }
      } catch (error) {
        console.error("Error fetching gift details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGift()

    // Listen for changes to saved gifts
    const handleStorageChange = () => {
      if (params.id) {
        setSaved(isGiftSaved(params.id as string))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [params.id])

  const handleSaveToggle = () => {
    if (!gift) return

    if (saved) {
      removeGift(gift.id)
    } else {
      saveGift(gift)
    }
    setSaved(!saved)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-24 bg-muted rounded w-full"></div>
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!gift) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Gift Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the gift you're looking for.</p>
        <Link href="/recommendations">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recommendations
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/recommendations" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recommendations
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          {gift.image ? (
            <Image
              src={gift.image || "/placeholder.svg"}
              alt={gift.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p>No Image Available</p>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{gift.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(gift.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {gift.rating.toFixed(1)} ({gift.reviews} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold mb-4">₹{Math.round(gift.price).toLocaleString("en-IN")}</div>
          <p className="text-muted-foreground mb-6">{gift.description}</p>

          <div className="mb-6">
            <GiftExplanation gift={gift} />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">{gift.category}</Badge>
            {gift.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button className="flex-1" onClick={handleSaveToggle}>
              {saved ? "Saved to Wishlist" : "Save to Wishlist"}
              <Bookmark className={`ml-2 h-4 w-4 ${saved ? "fill-primary-foreground" : ""}`} />
            </Button>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">
                Shipping
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <ul className="space-y-2">
                <li>
                  <strong>Category:</strong> {gift.category}
                </li>
                <li>
                  <strong>Tags:</strong> {gift.tags.join(", ")}
                </li>
                <li>
                  <strong>In Stock:</strong> Yes
                </li>
                <li>
                  <strong>Shipping:</strong> Free shipping available
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <p className="mb-2">Standard shipping (3-5 business days): Free</p>
              <p className="mb-2">Express shipping (1-2 business days): ₹830</p>
              <p>Gift wrapping available for an additional ₹415</p>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">Perfect gift!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">by Jane D. on March 12, 2025</p>
                  <p>Bought this as a birthday gift and they absolutely loved it! The quality was excellent.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}