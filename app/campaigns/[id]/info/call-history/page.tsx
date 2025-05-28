"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ChevronDown, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  const handleExport = () => {
    console.log("Exporting call history data...")
  }

  const handleViewDetails = (recordId: number) => {
    // Navigate to call details page
    router.push(`/campaigns/1/info/call-history/${recordId}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="text-sm text-gray-500">
          <motion.span
            className="cursor-pointer hover:text-gray-700 transition-colors duration-200"
            onClick={() => router.push("/campaigns")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Campaign
          </motion.span>
          <span className="mx-2">{">"}</span>
          <motion.span
            className="cursor-pointer hover:text-gray-700 transition-colors duration-200"
            onClick={() => router.back()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Info
          </motion.span>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-900 font-medium">Call History</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">Call History</h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleExport}
              className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium flex items-center transition-all duration-200"
            >
              <Upload className="mr-2 h-4 w-4" />
              EXPORT
            </Button>
          </motion.div>
        </motion.div>

        {/* Table Header */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-600"
        >
          <div className="col-span-1"></div>
          <div className="col-span-3">Phone Number</div>
          <div className="col-span-2 flex items-center">
            Status
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-3">Date & Time</div>
          <div className="col-span-2">Duration (Sec)</div>
          <div className="col-span-1">Call Details</div>
        </motion.div>

        {/* Call History Records */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence>
            {callHistory.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Checkbox
                        checked={record.selected}
                        onCheckedChange={(checked) => handleCheckboxChange(record.id, checked as boolean)}
                        className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333] transition-all duration-200"
                      />
                    </motion.div>
                  </div>
                  <div className="col-span-3">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="font-medium"
                    >
                      {record.phoneNumber}
                    </motion.span>
                  </div>
                  <div className="col-span-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        className={
                          record.status === "INIT"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        }
                      >
                        {record.status}
                      </Badge>
                    </motion.div>
                  </div>
                  <div className="col-span-3">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="text-gray-600"
                    >
                      {record.dateTime}
                    </motion.span>
                  </div>
                  <div className="col-span-2">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="text-gray-600"
                    >
                      {record.duration}
                    </motion.span>
                  </div>
                  <div className="col-span-1">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(record.id)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        DETAILS
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
