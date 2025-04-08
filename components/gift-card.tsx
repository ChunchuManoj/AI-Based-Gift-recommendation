"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Gift } from "@/types/gift"
import { Heart, Bookmark, Star } from "lucide-react"
import GiftExplanation from "@/components/gift-explanation"
import Link from "next/link"
import { saveGift, removeGift, isGiftSaved } from "@/lib/gift-utils"
import Image from "next/image"

interface GiftCardProps {
  gift: Gift
}

export default function GiftCard({ gift }: GiftCardProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isGiftSaved(gift.id))

    // Listen for changes to saved gifts
    const handleStorageChange = () => {
      setSaved(isGiftSaved(gift.id))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [gift.id])
  const [liked, setLiked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 bg-muted">
        {gift.image ? (
          <Image
            src={gift.image || "/placeholder.svg"}
            alt={gift.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-2xl font-bold text-muted-foreground">{gift.category}</div>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => {
              if (saved) {
                removeGift(gift.id)
              } else {
                saveGift(gift)
              }
              setSaved(!saved)
            }}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
        <Badge className="absolute bottom-2 left-2 bg-background/80 text-foreground backdrop-blur-sm">
          {gift.category}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{gift.name}</CardTitle>
          <span className="font-bold">₹{Math.round(gift.price).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(gift.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({gift.reviews} reviews)</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardDescription className="line-clamp-2 mb-2">{gift.description}</CardDescription>
        <div className="flex flex-wrap gap-1 mt-2">
          {gift.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" size="sm" asChild>
          <Link href={`/gift/${gift.id}`}>View Details</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowExplanation(!showExplanation)}>
          {showExplanation ? "Hide Why" : "Why?"}
        </Button>
      </CardFooter>
      {showExplanation && (
        <div className="px-4 pb-4">
          <GiftExplanation gift={gift} />
        </div>
      )}
    </Card>
  )
}
