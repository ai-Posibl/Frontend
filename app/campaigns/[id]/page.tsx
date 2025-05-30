"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, Search, RefreshCw, Upload, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Archive } from "lucide-react"

interface CallRecord {
  id: number
  phoneNumber: string
  status: string
  lastCallTime: string
  duration: string
  sentiment: "positive" | "neutral" | "negative"
}

export default function CampaignDetailsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [callRecords, setCallRecords] = useState<CallRecord[]>([
    {
      id: 1,
      phoneNumber: "91 6398328883",
      status: "SUCCESS",
      lastCallTime: "11th Feb 2025 | 10:30 AM",
      duration: "30:00",
      sentiment: "positive"
    },
    {
      id: 2,
      phoneNumber: "91 6398328884",
      status: "NO_ANSWER",
      lastCallTime: "11th Feb 2025 | 10:45 AM",
      duration: "0:00",
      sentiment: "neutral"
    },
    {
      id: 3,
      phoneNumber: "91 6398328885",
      status: "SUCCESS",
      lastCallTime: "11th Feb 2025 | 11:00 AM",
      duration: "25:30",
      sentiment: "negative"
    }
  ])

  const handleExportCSV = () => {
    console.log("Exporting campaign data as CSV...")
    const csvContent = [
      "Phone Number,Status,Date,Duration",
      ...callRecords.map(record => 
        `${record.phoneNumber},${record.status},${record.lastCallTime},${record.duration}`
      )
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "campaign_data.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleExportZIP = () => {
    console.log("Exporting campaign data as ZIP...")
    alert("ZIP export would include all call recordings and transcripts")
  }

  const handleCallClick = (phoneId: number) => {
    router.push(`/campaigns/1/calls/${phoneId}`)
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
          <span className="text-gray-900 font-medium">ODD Media</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-medium">ODD Media</h1>
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Last updated 5 mins ago</span>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Phone, label: "Calls Made", value: "238", subtitle: "Out of 300", color: "yellow" },
            { icon: MessageSquare, label: "Answer Rate", value: "85%", subtitle: "", color: "blue" },
            { icon: Phone, label: "Avg. Call Duration", value: "4:30", subtitle: "minutes", color: "green" },
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    stat.color === "yellow" 
                      ? "bg-yellow-100" 
                      : stat.color === "blue" 
                        ? "bg-blue-100" 
                        : "bg-green-100"
                  }`}
                >
                  <stat.icon
                    className={`h-5 w-5 ${
                      stat.color === "yellow"
                        ? "text-yellow-600"
                        : stat.color === "blue"
                          ? "text-blue-600"
                          : "text-green-600"
                    }`}
                  />
                </div>
                <span className="text-gray-600 font-medium text-xs">{stat.label}</span>
              </div>
              <div className="text-xl font-medium mb-2">{stat.value}</div>
              {stat.subtitle && <div className="text-xs text-gray-500">{stat.subtitle}</div>}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by phone number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white rounded-full border-gray-200 focus:ring-2 focus:ring-[#b5d333] focus:ring-opacity-20 text-xs"
          />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-6 px-6 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg">
          <div className="col-span-2">Phone Number</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Last Call</div>
          <div className="col-span-1">Duration</div>
          <div className="col-span-2">Sentiment</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Call Records */}
        <div className="space-y-3">
          {callRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-12 gap-6 items-center">
                <div 
                  className="col-span-2 cursor-pointer hover:text-[#b5d333] transition-colors"
                  onClick={() => handleCallClick(record.id)}
                >
                  <span className="font-medium">{record.phoneNumber}</span>
                </div>
                <div className="col-span-2">
                  <Badge 
                    className={
                      record.status === "SUCCESS"
                        ? "bg-green-100 text-green-800 font-normal"
                        : "bg-gray-100 text-gray-800 font-normal"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
                <div className="col-span-3 text-sm text-gray-600">
                  {record.lastCallTime}
                </div>
                <div className="col-span-1 text-sm text-gray-600">
                  {record.duration}
                </div>
                <div className="col-span-2">
                  <Badge
                    className={
                      record.sentiment === "positive"
                        ? "bg-green-100 text-green-800 font-normal"
                        : record.sentiment === "negative"
                          ? "bg-red-100 text-red-800 font-normal"
                          : "bg-gray-100 text-gray-800 font-normal"
                    }
                  >
                    {record.sentiment.toUpperCase()}
                  </Badge>
                </div>
                <div className="col-span-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCallClick(record.id)}
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#b5d333] hover:border-[#b5d333] transition-colors"
                  >
                    View Details
                    <ExternalLink className="h-3 w-3 ml-1 stroke-[1.5]" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
} 