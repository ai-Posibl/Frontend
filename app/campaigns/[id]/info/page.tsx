"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, Search, RefreshCw, ChevronDown, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  const handleViewData = (recordId: number) => {
    console.log("Viewing data for record:", recordId)
  }

  const handleCallHistory = (recordId: number) => {
    // Navigate to call history page
    router.push(`/campaigns/1/info/call-history`)
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
          <span className="text-gray-900 font-medium">Info</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">ODD Media</h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </motion.div>
            <span className="text-sm text-gray-500">Last updated 5 mins ago</span>
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

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Phone, label: "Calls Made", value: "5", subtitle: "Out of 100", color: "yellow" },
            { icon: MessageSquare, label: "Answer Rate", value: "30 %", subtitle: "", color: "blue" },
            { icon: Phone, label: "Avg. Call Duration", value: "243", subtitle: "sec", color: "red" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
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
                </motion.div>
                <span className="text-gray-600 font-medium">{stat.label}</span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold mb-2"
              >
                {stat.value}
              </motion.div>
              {stat.subtitle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  className="text-sm text-gray-500"
                >
                  {stat.subtitle}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white rounded-full border-gray-200 focus:ring-2 focus:ring-[#b5d333] focus:ring-opacity-20 transition-all duration-200"
          />
        </motion.div>

        {/* Table Header */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-600"
        >
          <div className="col-span-1"></div>
          <div className="col-span-3">Phone Number</div>
          <div className="col-span-3 flex items-center">
            Status
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-3">User Data</div>
          <div className="col-span-2">Call History</div>
        </motion.div>

        {/* Call Records */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence>
            {callRecords.map((record, index) => (
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
                  <div className="col-span-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 font-normal">{record.status}</Badge>
                    </motion.div>
                  </div>
                  <div className="col-span-3">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewData(record.id)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        VIEW DATA
                      </Button>
                    </motion.div>
                  </div>
                  <div className="col-span-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCallHistory(record.id)}
                        className="hover:bg-gray-100 transition-all duration-200"
                      >
                        <Phone className="h-4 w-4" />
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
