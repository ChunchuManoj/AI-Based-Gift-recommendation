import { Card, CardContent } from "@/components/ui/card"

export default function LoadingRecommendations() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-muted rounded-t-lg"></div>
          <CardContent className="p-4">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-5/6 mb-2"></div>
            <div className="h-3 bg-muted rounded w-4/6 mb-4"></div>
            <div className="flex gap-1 mb-4">
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
            </div>
            <div className="h-8 bg-muted rounded w-full"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

