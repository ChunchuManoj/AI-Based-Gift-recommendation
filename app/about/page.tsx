"use client"

import NavBar from "@/components/nav-bar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to the Gift Recommendation Platform! Our mission is to make gift-giving effortless and meaningful by leveraging advanced AI technology to provide personalized gift suggestions for every occasion.
          </p>
        </div>

        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We believe that every gift should tell a story and create lasting memories. Our platform is designed to help you find the perfect gift that resonates with the recipient's personality, interests, and preferences.
          </p>

          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-6">
            By combining user-provided survey data with cutting-edge AI models, we generate tailored gift recommendations that are thoughtful and unique. Whether it's a birthday, anniversary, or any special occasion, we've got you covered.
          </p>

          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-6">
            <li>Personalized recommendations based on detailed survey data.</li>
            <li>Wide range of categories to suit every taste and budget.</li>
            <li>Easy-to-use interface for a seamless experience.</li>
            <li>Secure and reliable platform with user privacy in mind.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}