import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Make sure this import is present
import { Providers } from "./providers"
import SavedGiftsWrapper from "@/components/saved-gifts-wrapper"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GiftGenius - Find the Perfect Gift",
  description: "AI-powered gift recommendations for any occasion",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
          <SavedGiftsWrapper />
        </Providers>
      </body>
    </html>
  )
}

