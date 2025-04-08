"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
  filters: {
    priceRange: number[]
    categories: string[]
    sortBy: string
  }
  categories: string[]
  onFilterChange: (filterType: string, value: any) => void
}

export default function FilterSidebar({ filters, categories, onFilterChange }: FilterSidebarProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onFilterChange("categories", [...filters.categories, category])
    } else {
      onFilterChange(
        "categories",
        filters.categories.filter((c) => c !== category),
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              min={0}
              max={500}
              step={10}
              minStepsBetweenThumbs={1}
              onValueChange={(value) => onFilterChange("priceRange", value)}
              className="py-4"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">${filters.priceRange[0]}</span>
              <span className="text-sm">${filters.priceRange[1]}+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onFilterChange("priceRange", [0, 500])
          onFilterChange("categories", [])
          onFilterChange("sortBy", "relevance")
        }}
      >
        Reset Filters
      </Button>
    </div>
  )
}

