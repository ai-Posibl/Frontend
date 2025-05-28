"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Upload, Play, Download, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function CallDetailsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Summary")
  const [isPlaying, setIsPlaying] = useState(false)

  const handleExport = () => {
    console.log("Exporting call details...")
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
      avatar: "/placeholder.svg?height=40&width=40&query=smiling woman with brown hair",
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
      avatar: "/placeholder.svg?height=40&width=40&query=smiling woman with brown hair",
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
            onClick={() => router.push("/campaigns/1/info")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Info
          </motion.span>
          <span className="mx-2">{">"}</span>
          <motion.span
            className="cursor-pointer hover:text-gray-700 transition-colors duration-200"
            onClick={() => router.back()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Call History
          </motion.span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">Call Details</h1>
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

        {/* Main Call Details Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200"
        >
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Section */}
            <div className="col-span-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
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
              </motion.div>
            </div>

            {/* Center Section */}
            <div className="col-span-4 text-center">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="text-lg font-medium text-gray-700 mb-2">Call Duration: 30:00 Min</div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-[#b5d333] text-black hover:bg-[#b5d333] font-medium px-4 py-1">SUCCESS</Badge>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="col-span-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <div className="text-lg font-medium text-gray-700 mb-3">Agent:</div>
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Image
                      src="/placeholder.svg?height=50&width=50&query=smiling woman with brown hair"
                      alt="Agent"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </motion.div>
                  <span className="font-medium">Riya-Wishfin v2 | Expert</span>
                </div>

                {/* Audio Player */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={handlePlayPause}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                    >
                      <Play className="h-4 w-4 ml-0.5" />
                    </motion.button>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-[#b5d333] h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "80%" }}
                          transition={{ delay: 0.6, duration: 1 }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">24:00/ 30:00 Min</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      DOWNLOAD
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-all duration-200 relative ${
                  activeTab === tab ? "text-black" : "text-gray-600 hover:text-gray-800"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b5d333]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "Summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="grid grid-cols-12 gap-8">
                  {/* Call Summary */}
                  <div className="col-span-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-lg font-bold mb-4">Call Summary</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Customer showed interest in the new AI-powered analytics platform, specifically asking about
                        features, pricing, and the free trial. Agent offered a 14-day free trial and discussed pricing
                        starting at $49/month. Next steps agreed: Set up the free trial and schedule a demo. Overall
                        sentiment of the call was positive.
                      </p>
                    </motion.div>
                  </div>

                  {/* Highlights */}
                  <div className="col-span-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-bold mb-4">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((highlight, index) => (
                          <motion.div
                            key={highlight.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge className={`${highlight.color} hover:${highlight.color} font-medium`}>
                              {highlight.label}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Personal Details" && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="grid grid-cols-12 gap-8">
                  {/* Personal Details */}
                  <div className="col-span-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
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
                    </motion.div>
                  </div>

                  {/* Highlights */}
                  <div className="col-span-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-bold mb-4">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((highlight, index) => (
                          <motion.div
                            key={highlight.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge className={`${highlight.color} hover:${highlight.color} font-medium`}>
                              {highlight.label}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Transcript" && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="grid grid-cols-12 gap-8">
                  {/* Transcript */}
                  <div className="col-span-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-lg font-bold mb-6">Transcript</h3>
                      <div className="space-y-6">
                        {transcriptMessages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="flex items-start space-x-3"
                          >
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
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Highlights */}
                  <div className="col-span-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-bold mb-4">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((highlight, index) => (
                          <motion.div
                            key={highlight.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge className={`${highlight.color} hover:${highlight.color} font-medium`}>
                              {highlight.label}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
