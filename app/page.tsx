import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NavBar from "@/components/nav-bar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Find the Perfect Gift</h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Our AI-powered platform helps you discover thoughtful, personalized gift ideas for any occasion.
            </p>
            <Link href="/survey">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Gift Finder
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    1
                  </div>
                  Tell Us About Them
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Answer a few questions about the recipient's personality, interests, and the occasion.</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    2
                  </div>
                  Get AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our AI analyzes your responses to generate personalized gift suggestions.</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    3
                  </div>
                  Find the Perfect Gift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Browse, filter, and refine recommendations until you find the perfect gift.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Tech Lovers", "Foodies", "Outdoor Enthusiasts", "Book Worms"].map((category) => (
                <Card key={category} className="group cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-medium text-lg group-hover:text-primary">{category}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to find the perfect gift?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take our quick survey and get personalized recommendations in minutes.
            </p>
            <Link href="/survey">
              <Button size="lg">Start Now</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">© 2025 GiftGenius. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-muted-foreground hover:text-primary">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

