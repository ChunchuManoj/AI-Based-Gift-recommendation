"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromSession()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      setUser(data.user)

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Auto login after registration
      await login(email, password)
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

