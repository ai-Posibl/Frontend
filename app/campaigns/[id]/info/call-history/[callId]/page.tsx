"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Upload, Play, Download, ArrowRight, Pause } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useAuth, withAuth } from "@/hooks/use-auth"
import { callApi } from "@/lib/api"
import { toast } from "sonner"

interface CallDetail {
  id: string
  campaignId: string
  agentId: string
  contactId?: string
  phoneNumber: string
  name?: string
  status: string
  type: string
  scheduledAt?: string
  startedAt?: string
  endedAt?: string
  durationSeconds?: number
  recordingUrl?: string
  transcriptUrl?: string
  summary?: string
  notes?: string
  sentimentScore?: number
  highlights?: string[]
  campaign?: any
  agent?: any
  contact?: any
  variables?: string
}

interface TranscriptMessage {
  content: string
  role: string
  timestamp?: string
  speaker?: string
  text?: string
}

interface StructuredData {
  employment_type?: string
  user_pincode?: number
  company_name?: string
  company_address?: string
  company_pincode?: number
  user_mail?: string
  emi_tenure?: string
  is_rescheduled?: boolean
  reschedule_at?: string
  [key: string]: any
}

function CallDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [callDetails, setCallDetails] = useState<CallDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Summary")
  const [isPlaying, setIsPlaying] = useState(false)
  const [parsedTranscript, setParsedTranscript] = useState<TranscriptMessage[]>([])
  const [structuredData, setStructuredData] = useState<StructuredData>({})

  const campaignId = params.id as string
  const callId = params.callId as string

  // Parse transcript from JSON string
  const parseTranscript = (transcriptUrl?: string): TranscriptMessage[] => {
    if (!transcriptUrl) return []
    
    try {
      const parsed = JSON.parse(transcriptUrl)
      
      // Handle different transcript formats
      if (Array.isArray(parsed)) {
        return parsed.map((item, index) => {
          // Handle role-based format: {content: "...", role: "assistant|user"}
          if (item.content && item.role) {
            return {
              content: item.content,
              role: item.role,
              speaker: item.role === 'assistant' ? 'agent' : 'customer',
              timestamp: item.timestamp || `00:${index.toString().padStart(2, '0')}:00`
            }
          }
          // Handle conversation format: {speaker: "...", text: "..."}
          else if (item.speaker && item.text) {
            return {
              content: item.text,
              role: item.speaker === 'agent' ? 'assistant' : 'user',
              speaker: item.speaker,
              timestamp: item.timestamp || `00:${index.toString().padStart(2, '0')}:00`
            }
          }
          return item
        })
      }
      
      return []
    } catch (error) {
      console.error('Failed to parse transcript:', error)
      return []
    }
  }

  // Parse structured data from notes
  const parseStructuredData = (notes?: string): StructuredData => {
    if (!notes) return {}
    
    try {
      const parsed = JSON.parse(notes)
      return parsed
    } catch (error) {
      console.error('Failed to parse structured data:', error)
      return {}
    }
  }

  // Generate highlights from structured data
  const generateHighlights = (data: StructuredData, highlights?: string[]): Array<{label: string, color: string}> => {
    const generatedHighlights: Array<{label: string, color: string}> = []
    
    // Add highlights from database if available
    if (highlights && highlights.length > 0) {
      highlights.forEach(highlight => {
        generatedHighlights.push({
          label: highlight,
          color: "bg-[#b5d333] text-black"
        })
      })
    }
    
    // Generate highlights from structured data
    if (data.emi_tenure && data.emi_tenure !== 'null' && data.emi_tenure !== 'None') {
      generatedHighlights.push({
        label: `${data.emi_tenure} EMI`,
        color: "bg-green-100 text-green-800"
      })
    }
    
    if (data.employment_type && data.employment_type !== 'null') {
      generatedHighlights.push({
        label: data.employment_type,
        color: "bg-blue-100 text-blue-800"
      })
    }
    
    if (data.company_name && data.company_name !== 'null') {
      generatedHighlights.push({
        label: data.company_name,
        color: "bg-purple-100 text-purple-800"
      })
    }
    
    if (data.is_rescheduled) {
      generatedHighlights.push({
        label: "Rescheduled",
        color: "bg-orange-100 text-orange-800"
      })
    }
    
    return generatedHighlights
  }

  // Fetch call details from backend
  useEffect(() => {
    const fetchCallDetails = async () => {
      if (!user || !callId) return

      try {
        setIsLoading(true)
        console.log(`Fetching call details for call ${callId}...`)
        
        const call = await callApi.getById(callId)
        console.log('Call details fetched successfully:', call)
        
        setCallDetails(call)
        
        // Parse transcript and structured data
        const transcript = parseTranscript(call.transcriptUrl)
        const structured = parseStructuredData(call.notes)
        
        setParsedTranscript(transcript)
        setStructuredData(structured)
        
        console.log('Parsed transcript:', transcript)
        console.log('Parsed structured data:', structured)
        
        toast.success('Call details loaded')
      } catch (error) {
        console.error('Failed to fetch call details:', error)
        toast.error(`Failed to load call details: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCallDetails()
  }, [user, callId])

  const handleRefresh = async () => {
    if (!user || !callId) return
    
    try {
      setIsLoading(true)
      // Clear cache to force fresh data
      callApi.clearCache(`call_details_${callId}`)
      
      const call = await callApi.getById(callId, false)
      setCallDetails(call)
      
      // Re-parse data
      const transcript = parseTranscript(call.transcriptUrl)
      const structured = parseStructuredData(call.notes)
      
      setParsedTranscript(transcript)
      setStructuredData(structured)
      
      toast.success('Call details refreshed')
    } catch (error) {
      console.error('Failed to refresh call details:', error)
      toast.error('Failed to refresh call details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!callDetails) return
    
    const exportData = {
      callId: callDetails.id,
      phoneNumber: callDetails.phoneNumber,
      name: callDetails.name,
      status: callDetails.status,
      type: callDetails.type,
      scheduledAt: callDetails.scheduledAt,
      startedAt: callDetails.startedAt,
      endedAt: callDetails.endedAt,
      duration: callDetails.durationSeconds,
      campaign: callDetails.campaign?.name,
      agent: callDetails.agent?.name,
      summary: callDetails.summary,
      notes: callDetails.notes,
      sentimentScore: callDetails.sentimentScore,
      highlights: callDetails.highlights,
      transcript: parsedTranscript,
      structuredData: structuredData
    }
    
    const jsonContent = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `call-details-${callId}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('Call details exported')
  }

  const handleDownload = () => {
    if (callDetails?.recordingUrl) {
      window.open(callDetails.recordingUrl, '_blank')
      toast.success('Opening call recording')
    } else {
      toast.error('No call recording available')
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control audio playback
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} Min`
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return "bg-[#b5d333] text-black hover:bg-[#b5d333]"
      case 'failed':
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case 'in_progress':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case 'scheduled':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Parse variables if available
  const parseVariables = (variableString?: string) => {
    if (!variableString) return {}
    try {
      return JSON.parse(variableString)
    } catch {
      return {}
    }
  }

  const tabs = ["Summary", "Personal Details", "Transcript"]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center min-h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
            />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!callDetails) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">Call not found</div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-black text-black hover:bg-gray-100"
            >
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const variables = parseVariables(callDetails.variables)
  const highlights = generateHighlights(structuredData, callDetails.highlights)

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
            onClick={() => router.push(`/campaigns/${campaignId}/info`)}
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
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </motion.button>
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
                <h2 className="text-xl font-bold mb-4">{callDetails.type.charAt(0).toUpperCase() + callDetails.type.slice(1)} Call</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="font-medium">Posibl.ai</span>
                    <ArrowRight className="h-4 w-4" />
                    <span>{callDetails.phoneNumber}</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Campaign:</span> {callDetails.campaign?.name || 'ODD Media'}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Date & Time:</span> {formatDate(callDetails.scheduledAt)}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Center Section */}
            <div className="col-span-4 text-center">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="text-lg font-medium text-gray-700 mb-2">Call Duration: {formatDuration(callDetails.durationSeconds)}</div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <Badge className={`${getStatusBadgeClass(callDetails.status)} font-medium px-4 py-1`}>
                    {callDetails.status.charAt(0).toUpperCase() + callDetails.status.slice(1) === 'Completed' ? 'SUCCESS' : callDetails.status.charAt(0).toUpperCase() + callDetails.status.slice(1)}
                  </Badge>
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
                  <span className="font-medium">{callDetails.agent?.name || 'Riya-Wishfin v2'} | Expert</span>
                </div>

                {/* Recording Control */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Call Recording</div>
                      <div className="text-sm text-gray-500">{callDetails.recordingUrl ? 'Available' : 'Not Available'}</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayPause}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                        isPlaying ? "bg-gray-300" : "bg-black"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-black" />
                      ) : (
                        <Play className="h-5 w-5 text-[#b5d333]" />
                      )}
                    </motion.button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div
                          className="bg-[#b5d333] h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "80%" }}
                      transition={{ duration: 2, delay: 1 }}
                        />
                  </div>
                  <span className="text-sm text-gray-500">24:00/ {formatDuration(callDetails.durationSeconds)}</span>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-3">
                    <Button
                      onClick={handleDownload}
                    disabled={!callDetails.recordingUrl}
                      variant="outline"
                    className="w-full border-black text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      DOWNLOAD
                    </Button>
                  </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tabs and Content */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-black text-[#b5d333] border-b-2 border-[#b5d333]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div className="p-8" key={activeTab}>
          <AnimatePresence mode="wait">
            {activeTab === "Summary" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                  className="grid grid-cols-12 gap-8"
              >
                  <div className="col-span-8">
                      <h3 className="text-lg font-bold mb-4">Call Summary</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {callDetails.summary || 'No summary available for this call.'}
                      </p>
                    
                    {callDetails.sentimentScore !== undefined && callDetails.sentimentScore !== null && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Sentiment Analysis</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#b5d333] h-2 rounded-full" 
                              style={{ width: `${Math.max(0, callDetails.sentimentScore * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {Math.max(0, callDetails.sentimentScore * 100).toFixed(0)}% Positive
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {Object.keys(structuredData).length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Call Analytics</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(structuredData).map(([key, value]) => {
                            if (value && value !== 'null' && value !== null) {
                              return (
                                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-600 capitalize">
                                    {key.replace(/_/g, ' ')}
                                  </div>
                                  <div className="font-medium">
                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-span-4">
                      <h3 className="text-lg font-bold mb-4">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {highlights.length > 0 ? highlights.map((highlight, index) => (
                        <motion.span
                          key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${highlight.color}`}
                          >
                              {highlight.label}
                        </motion.span>
                        )) : (
                          <div className="text-gray-500 text-sm">No highlights available</div>
                        )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Personal Details" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                    >
                  <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="text-gray-700">
                      <span className="font-medium">Name:</span> {callDetails.name || callDetails.contact?.firstName + ' ' + callDetails.contact?.lastName || 'N/A'}
                        </div>
                        <div className="text-gray-700">
                      <span className="font-medium">Phone:</span> {callDetails.phoneNumber}
                        </div>
                        <div className="text-gray-700">
                      <span className="font-medium">Email:</span> {callDetails.contact?.email || structuredData.user_mail || 'N/A'}
                    </div>
                    
                    {/* Display structured data from Gemini AI */}
                    {Object.keys(structuredData).length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Extracted Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(structuredData).map(([key, value]) => {
                            if (value && value !== 'null' && value !== null) {
                              return (
                                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-600 capitalize font-medium">
                                    {key.replace(/_/g, ' ')}
                                  </div>
                                  <div className="text-gray-900 mt-1">
                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Display contact variables */}
                    {Object.keys(variables).length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Additional Contact Details</h4>
                        <div className="space-y-2">
                          {Object.entries(variables).map(([key, value]) => (
                            <div key={key} className="text-gray-700">
                              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
                        </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </motion.div>
            )}

            {activeTab === "Transcript" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                  <h3 className="text-lg font-bold mb-4">Call Transcript</h3>
                  {parsedTranscript.length > 0 ? (
                    <div className="space-y-4">
                        {parsedTranscript.map((message, index) => (
                          <motion.div
                            key={index}
                          initial={{ opacity: 0, x: message.speaker === 'agent' ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start space-x-3 ${
                            message.speaker === 'customer' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                          >
                            <div className="flex-shrink-0">
                              {message.speaker === 'agent' ? (
                                <Image
                                  src="/placeholder.svg?height=32&width=32&query=smiling woman with brown hair"
                                  alt="Agent"
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              ) : (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                                  {callDetails.name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.speaker === 'agent'
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-black text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.timestamp && (
                              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                            )}
                          </div>
                          </motion.div>
                        ))}
                       </div>
                   ) : callDetails.transcriptUrl ? (
                     <div className="text-gray-700">
                       <p className="mb-4">Raw transcript data available.</p>
                       <div className="bg-gray-50 p-4 rounded-lg mb-4">
                         <pre className="text-sm whitespace-pre-wrap">{callDetails.transcriptUrl}</pre>
                       </div>
                       <Button
                         onClick={() => {
                           navigator.clipboard.writeText(callDetails.transcriptUrl || '')
                           toast.success('Transcript copied to clipboard')
                         }}
                         className="bg-black text-[#b5d333] hover:bg-gray-900"
                       >
                         Copy Transcript
                       </Button>
                     </div>
                   ) : (
                     <div className="text-gray-500">
                       No transcript available for this call.
                     </div>
                   )}
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

export default withAuth(CallDetailsPage)
