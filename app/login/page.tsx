"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      await login({ email, password })
      toast({
        title: "Success",
        description: "Login successful!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Platform info and visuals */}
      <div className="hidden md:flex md:w-1/2 bg-white p-8 flex-col justify-between">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md">
            <div className="mb-8 flex justify-center">
              <Image
                src="/dashboard-cards.png"
                alt="Dashboard Analytics"
                width={400}
                height={300}
                className="w-auto h-auto"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold uppercase mb-2">Conversational</h2>
              <h1 className="text-2xl font-bold uppercase mb-6">Intelligence Platform for BFSI</h1>
              <p className="text-gray-600 text-center">
                AI-driven platform for automating voice interactions
                <br />
                and extracting insights in BFSI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-center mb-12">
            <Image src="/logo.png" alt="Posibl.ai" width={180} height={48} className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-8">Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Enter Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember Me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-black hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-black text-[#b5d333] hover:bg-gray-900"
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "CONTINUE"}
            </Button>
          </form>
          
          
        </div>
      </div>
    </div>
  )
}
