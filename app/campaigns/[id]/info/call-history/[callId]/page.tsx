"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Upload, Play, Download, ArrowRight } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Archive } from "lucide-react"

export default function CallDetailsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Summary")
  const [isPlaying, setIsPlaying] = useState(false)

  const handleExportCSV = () => {
    console.log("Exporting call details as CSV...")

    // Create CSV content with call details
    const csvContent = [
      "Field,Value",
      "Phone Number,91 6398328883",
      "Campaign,ODD Media",
      "Date & Time,11th Feb 2025 | 10:30 AM",
      "Duration,30:00 Min",
      "Status,SUCCESS",
      "Agent,Riya-Wishfin v2 | Expert",
    ].join("\n")

    // Download CSV
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

    // Simulate ZIP export with call recording and transcript
    alert("ZIP export would include call recording, transcript, and summary files")
  }

  const handleDownload = () => {
    console.log("Downloading call recording...")
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const tabs = ["Summary", "Personal Details", "Transcript"]

  const highlights = [
    { label: "14 Day Free Trial", color: "bg-[#b5d333] text-black" },
    { label: "Pricing", color: "bg-gray-100 text-gray-800" },
    { label: "$49", color: "bg-gray-100 text-gray-800" },
    { label: "Demo", color: "bg-gray-100 text-gray-800" },
  ]

  const transcriptMessages = [
    {
      id: 1,
      speaker: "agent",
      avatar: "/placeholder.svg?height=40&width=40",
      message:
        "Hi there! Thanks for taking the time to connect today. I understand you're interested in our new AI-powered analytics platform?",
    },
    {
      id: 2,
      speaker: "customer",
      avatar: "N",
      message:
        "Yes, I've been looking into different analytics tools, and yours caught my eye. I'm particularly curious about the features, pricing, and if you offer any kind of free trial.",
    },
    {
      id: 3,
      speaker: "agent",
      avatar: "/placeholder.svg?height=40&width=40",
      message:
        "Our platform uses AI to provide real-time insights, predictive trends, and automated reports. It's designed to be intuitive, so teams can make data-driven decisions faster.",
    },
    {
      id: 4,
      speaker: "customer",
      avatar: "N",
      message:
        "As for pricing, it starts at $49 per month for the basic plan. And yes, we do offer a 14-day free trial so you can explore all the features before committing.",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/campaigns")}>
            Campaign
          </span>
          <span className="mx-2">{">"}</span>
          <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/campaigns/1/info")}>
            Info
          </span>
          <span className="mx-2">{">"}</span>
          <span className="cursor-pointer hover:text-gray-700" onClick={() => router.back()}>
            Call History
          </span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">Call Details</h1>
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium flex items-center">
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

        {/* Main Call Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Section */}
            <div className="col-span-4">
              <h2 className="text-xl font-bold mb-4">Outbound Call</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <span className="font-medium">Posibl.ai</span>
                  <ArrowRight className="h-4 w-4" />
                  <span>91 6398328883</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Campaign:</span> ODD Media
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Date & Time:</span> 11th Feb, 2025 | 10:30 AM
                </div>
              </div>
            </div>

            {/* Center Section */}
            <div className="col-span-4 text-center">
              <div className="text-lg font-medium text-gray-700 mb-2">Call Duration: 30:00 Min</div>
              <Badge className="bg-[#b5d333] text-black hover:bg-[#b5d333] font-medium px-4 py-1">SUCCESS</Badge>
            </div>

            {/* Right Section */}
            <div className="col-span-4">
              <div className="text-base font-medium text-gray-700 mb-3">Agent:</div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/placeholder.svg?height=50&width=50"
                  alt="Agent"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <span className="font-medium text-sm">Riya-Wishfin v2 | Expert</span>
              </div>

              {/* Audio Player */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayPause}
                    className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800"
                  >
                    <Play className="h-4 w-4 ml-0.5" />
                  </button>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#b5d333] h-2 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">24:00/ 30:00 Min</span>
                </div>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                >
                  <Download className="mr-2 h-4 w-4" />
                  DOWNLOAD
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium text-xs relative ${
                  activeTab === tab ? "text-black" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b5d333]" />}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Summary" && (
            <div className="p-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Call Summary */}
                <div className="col-span-8">
                  <h3 className="text-base font-bold mb-4">Call Summary</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Customer showed interest in the new AI-powered analytics platform, specifically asking about
                    features, pricing, and the free trial. Agent offered a 14-day free trial and discussed pricing
                    starting at $49/month. Next steps agreed: Set up the free trial and schedule a demo. Overall
                    sentiment of the call was positive.
                  </p>
                </div>

                {/* Highlights */}
                <div className="col-span-4">
                  <h3 className="text-lg font-bold mb-4">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((highlight, index) => (
                      <Badge
                        key={highlight.label}
                        className={`${highlight.color} hover:${highlight.color} font-medium`}
                      >
                        {highlight.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Personal Details" && (
            <div className="p-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Personal Details */}
                <div className="col-span-8">
                  <h3 className="text-lg font-bold mb-4">Personal Details</h3>
                  <div className="space-y-3">
                    <div className="text-gray-700">
                      <span className="font-medium">Name:</span> Jithesh Narayan
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">DOB:</span> 11/5/2002
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Pan Details:</span> BXZZHH874J
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Aadhar Details:</span> 2545 2545 2154 2410
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="col-span-4">
                  <h3 className="text-lg font-bold mb-4">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((highlight, index) => (
                      <Badge
                        key={highlight.label}
                        className={`${highlight.color} hover:${highlight.color} font-medium`}
                      >
                        {highlight.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Transcript" && (
            <div className="p-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Transcript */}
                <div className="col-span-8">
                  <h3 className="text-lg font-bold mb-6">Transcript</h3>
                  <div className="space-y-6">
                    {transcriptMessages.map((message, index) => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {message.speaker === "agent" ? (
                            <Image
                              src={message.avatar || "/placeholder.svg"}
                              alt="Agent"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                              {message.avatar}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="col-span-4">
                  <h3 className="text-lg font-bold mb-4">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((highlight, index) => (
                      <Badge
                        key={highlight.label}
                        className={`${highlight.color} hover:${highlight.color} font-medium`}
                      >
                        {highlight.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
