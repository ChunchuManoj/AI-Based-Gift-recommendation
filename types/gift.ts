export interface Gift {
  id: string
  name: string
  description: string
  price: number
  image: string // This can now be empty
  category: string
  tags: string[]
  rating: number
  reviews: number
  url: string
  reason: string
}

