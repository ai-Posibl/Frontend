"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on mount
  useEffect(() => {
    // In a real app, you would check for a token in localStorage or cookies
    const checkAuth = () => {
      const token = localStorage.getItem("auth-token")
      setIsAuthenticated(!!token)
    }

    checkAuth()
  }, [])

  // Redirect based on auth status
  useEffect(() => {
    if (isAuthenticated && pathname === "/login") {
      router.push("/")
    }
  }, [isAuthenticated, pathname, router])

  const login = () => {
    // In a real app, you would store a token
    localStorage.setItem("auth-token", "dummy-token")
    setIsAuthenticated(true)
    router.push("/")
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    setIsAuthenticated(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
