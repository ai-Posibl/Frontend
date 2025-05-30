import type React from "react"
import type { Metadata } from "next"
import { Lexend } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Posibl.ai",
  description: "Conversational Intelligence Platform for BFSI",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
