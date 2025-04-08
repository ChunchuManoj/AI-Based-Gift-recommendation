import { Card, CardContent } from "@/components/ui/card"
import type { Gift } from "@/types/gift"

interface GiftExplanationProps {
  gift: Gift
  className?: string
}

export default function GiftExplanation({ gift, className = "" }: GiftExplanationProps) {
  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-4 bg-primary/5">
        <h3 className="font-medium mb-2 text-primary">Why We Recommend This</h3>
        <p className="text-sm">{gift.reason}</p>
      </CardContent>
    </Card>
  )
}

