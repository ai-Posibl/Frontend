"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ChevronDown, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Archive } from "lucide-react"

interface CallHistoryRecord {
  id: number
  phoneNumber: string
  status: string
  dateTime: string
  duration: string
  selected: boolean
}

export default function CallHistoryPage() {
  const router = useRouter()
  const [callHistory, setCallHistory] = useState<CallHistoryRecord[]>([
    {
      id: 1,
      phoneNumber: "91 6398328883",
      status: "INIT",
      dateTime: "23 Apr 2025 | 15:24",
      duration: "N/A",
      selected: false,
    },
    {
      id: 2,
      phoneNumber: "91 6398328883",
      status: "Rescheduled",
      dateTime: "23 Apr 2025 | 15:24",
      duration: "243",
      selected: false,
    },
  ])

  const handleCheckboxChange = (recordId: number, checked: boolean) => {
    setCallHistory(callHistory.map((record) => (record.id === recordId ? { ...record, selected: checked } : record)))
  }

  const handleExportCSV = () => {
    console.log("Exporting call history as CSV...")

    // Create CSV content
    const csvContent = [
      "Phone Number,Status,Date & Time,Duration",
      ...callHistory.map((record) => `${record.phoneNumber},${record.status},${record.dateTime},${record.duration}`),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "call_history.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleExportZIP = () => {
    console.log("Exporting call history as ZIP...")

    // Simulate ZIP export (in real app, you'd use a library like JSZip)
    alert("ZIP export functionality would be implemented here with JSZip library")
  }

  const handleViewDetails = (recordId: number) => {
    // Navigate to call details page
    router.push(`/campaigns/1/info/call-history/${recordId}`)
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
          <span className="cursor-pointer hover:text-gray-700" onClick={() => router.back()}>
            Info
          </span>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-900 font-medium">Call History</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">Call History</h1>
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

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-600">
          <div className="col-span-1"></div>
          <div className="col-span-3">Phone Number</div>
          <div className="col-span-2 flex items-center">
            Status
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-3">Date & Time</div>
          <div className="col-span-2">Duration (Sec)</div>
          <div className="col-span-1">Call Details</div>
        </div>

        {/* Call History Records */}
        <div className="space-y-4">
          {callHistory.map((record, index) => (
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
                  <span className="font-medium">{record.phoneNumber}</span>
                </div>
                <div className="col-span-2">
                  <Badge
                    className={
                      record.status === "INIT"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-600">{record.dateTime}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">{record.duration}</span>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(record.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    DETAILS
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
