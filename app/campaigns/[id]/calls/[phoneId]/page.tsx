"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Upload, Play, Download } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Archive } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CallDetailsPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)

  const handleExportCSV = () => {
    console.log("Exporting call details as CSV...")
    const csvContent = [
      "Field,Value",
      "Phone Number,91 6398328883",
      "Campaign,ODD Media",
      "Date & Time,11th Feb 2025 | 10:30 AM",
      "Duration,30:00 Min",
      "Status,SUCCESS",
      "Agent,Riya-Wishfin v2 | Expert",
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "call_details.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleExportZIP = () => {
    console.log("Exporting call details as ZIP...")
    alert("ZIP export would include call recording, transcript, and summary files")
  }

  const handleDownload = () => {
    console.log("Downloading call recording...")
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/campaigns")}>
            Campaigns
          </span>
          <span className="mx-2">{">"}</span>
          <span className="cursor-pointer hover:text-gray-700" onClick={() => router.back()}>
            ODD Media
          </span>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-900 font-medium">Call Details</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-medium">Call Details</h1>
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-black text-[#b5d333] hover:bg-gray-900 font-normal flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                EXPORT
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExportCSV()} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportZIP()} className="cursor-pointer">
                <Archive className="mr-2 h-4 w-4" />
                <span>Export as ZIP</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Call Info Card */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                <div className="text-lg font-medium">91 6398328883</div>
              </div>
              <Badge className="bg-green-100 text-green-800 font-normal">SUCCESS</Badge>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                <div className="font-medium">11th Feb 2025 | 10:30 AM</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="font-medium">30:00 Min</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Agent</div>
                <div className="font-medium">Riya-Wishfin v2 | Expert</div>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlayPause}
                className="h-8 w-8 rounded-full"
              >
                <Play className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-[#b5d333] rounded-full w-1/3" />
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                className="h-8 w-8 rounded-full"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-2">Sentiment Analysis</div>
              <div className="text-2xl font-medium text-green-600">Positive</div>
              <div className="text-sm text-gray-500 mt-1">Based on conversation tone</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-2">Key Topics</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-normal">Product Info</Badge>
                <Badge variant="outline" className="font-normal">Pricing</Badge>
                <Badge variant="outline" className="font-normal">Features</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b">
            <TabsTrigger value="transcript" className="font-normal">Transcript</TabsTrigger>
            <TabsTrigger value="summary" className="font-normal">Summary</TabsTrigger>
            <TabsTrigger value="personal" className="font-normal">Personal Details</TabsTrigger>
          </TabsList>
          <TabsContent value="transcript" className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Image
                  src="/placeholder.svg"
                  alt="Agent"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">Agent</div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    Hello! This is Riya from Wishfin. How may I assist you today?
                  </div>
                </div>
                <div className="text-xs text-gray-500">10:30 AM</div>
              </div>
              <div className="flex items-start space-x-4">
                <Image
                  src="/placeholder.svg"
                  alt="Customer"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">Customer</div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    Hi, I'm interested in learning more about your products.
                  </div>
                </div>
                <div className="text-xs text-gray-500">10:31 AM</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="summary" className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Key Points Discussed</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Customer inquired about product features</li>
                  <li>Discussed pricing options and packages</li>
                  <li>Explained implementation timeline</li>
                  <li>Addressed security concerns</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Action Items</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Send product brochure</li>
                  <li>Schedule follow-up call next week</li>
                  <li>Share case studies</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="personal" className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Full Name</div>
                <div className="font-medium">John Smith</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="font-medium">john.smith@example.com</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Company</div>
                <div className="font-medium">Tech Corp</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Position</div>
                <div className="font-medium">IT Manager</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 