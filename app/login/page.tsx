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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Just redirect to the dashboard without auth
    router.push("/")
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
              <p className="text-gray-600 text-center text-lg">
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
              <Label htmlFor="email" className="text-base">
                Enter Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="suman.pl"
                required
                className="text-base h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base h-12"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember Me
                </label>
              </div>
              <Link href="#" className="text-base text-black hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-[#b5d333] hover:bg-gray-900 h-12 text-base font-medium"
            >
              CONTINUE
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
