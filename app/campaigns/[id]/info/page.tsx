"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, Search, RefreshCw, ChevronDown, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Archive } from "lucide-react"

interface CallRecord {
  id: number
  phoneNumber: string
  status: string
  selected: boolean
}

export default function CampaignInfoPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [callRecords, setCallRecords] = useState<CallRecord[]>([
    {
      id: 1,
      phoneNumber: "91 6398328883",
      status: "NO_ACK_AGENT",
      selected: false,
    },
    {
      id: 2,
      phoneNumber: "91 6398328883",
      status: "NO_ACK_AGENT",
      selected: false,
    },
  ])

  const handleCheckboxChange = (recordId: number, checked: boolean) => {
    setCallRecords(callRecords.map((record) => (record.id === recordId ? { ...record, selected: checked } : record)))
  }

  const handleExport = () => {
    console.log("Exporting campaign data...")
  }

  const handleExportCSV = () => {
    console.log("Exporting campaign data as CSV...")

    // Create CSV content
    const csvContent = [
      "Phone Number,Status,Date,Duration",
      ...callRecords.map((record) => `${record.phoneNumber},${record.status},${new Date().toLocaleDateString()},243`),
    ].join("\n")

    // Download CSV
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

    // Simulate ZIP export (in real app, you'd use a library like JSZip)
    alert("ZIP export functionality would be implemented here with JSZip library")
  }

  const handleViewData = (recordId: number) => {
    console.log("Viewing data for record:", recordId)
  }

  const handleCallHistory = (recordId: number) => {
    // Navigate to call history page
    router.push(`/campaigns/1/info/call-history`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/campaigns")}>
            Campaign
          </span>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-900 font-medium">Info</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">ODD Media</h1>
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Last updated 5 mins ago</span>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Phone, label: "Calls Made", value: "5", subtitle: "Out of 100", color: "yellow" },
            { icon: MessageSquare, label: "Answer Rate", value: "30 %", subtitle: "", color: "blue" },
            { icon: Phone, label: "Avg. Call Duration", value: "243", subtitle: "sec", color: "red" },
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    stat.color === "yellow" ? "bg-yellow-100" : stat.color === "blue" ? "bg-blue-100" : "bg-red-100"
                  }`}
                >
                  <stat.icon
                    className={`h-5 w-5 ${
                      stat.color === "yellow"
                        ? "text-yellow-600"
                        : stat.color === "blue"
                          ? "text-blue-600"
                          : "text-red-600"
                    }`}
                  />
                </div>
                <span className="text-gray-600 font-medium text-xs">{stat.label}</span>
              </div>
              <div className="text-xl font-bold mb-2">{stat.value}</div>
              {stat.subtitle && <div className="text-xs text-gray-500">{stat.subtitle}</div>}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white rounded-full border-gray-200 focus:ring-2 focus:ring-[#b5d333] focus:ring-opacity-20 text-xs"
          />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-600">
          <div className="col-span-1"></div>
          <div className="col-span-3">Phone Number</div>
          <div className="col-span-3 flex items-center">
            Status
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-3">User Data</div>
          <div className="col-span-2">Call History</div>
        </div>

        {/* Call Records */}
        <div className="space-y-4">
          {callRecords.map((record, index) => (
            <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <Checkbox
                    checked={record.selected}
                    onCheckedChange={(checked) => handleCheckboxChange(record.id, checked as boolean)}
                    className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333]"
                  />
                </div>
                <div className="col-span-3">
                  <span className="font-medium text-xs">{record.phoneNumber}</span>
                </div>
                <div className="col-span-3">
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 font-normal text-xs">{record.status}</Badge>
                </div>
                <div className="col-span-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewData(record.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    VIEW DATA
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCallHistory(record.id)}
                    className="hover:bg-gray-100"
                  >
                    <Phone className="h-4 w-4" />
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
