"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ChevronDown, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth, withAuth } from "@/hooks/use-auth"
import { callApi } from "@/lib/api"
import { toast } from "sonner"

interface CallHistoryRecord {
  id: string
  phoneNumber: string
  name?: string
  status: string
  dateTime: string
  duration: string
  selected: boolean
  type: string
  startedAt?: string
  endedAt?: string
  durationSeconds?: number
}

function CallHistoryPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [callHistory, setCallHistory] = useState<CallHistoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCount, setSelectedCount] = useState(0)
  
  const campaignId = params.id as string

  // Fetch call history from backend
  useEffect(() => {
    const fetchCallHistory = async () => {
      if (!user || !campaignId) return

      try {
        setIsLoading(true)
        console.log(`Fetching call history for campaign ${campaignId}...`)
        
        const calls = await callApi.getByCampaign(campaignId)
        console.log('Call history fetched successfully:', calls)
        
        // Transform backend data to frontend interface
        const transformedCalls: CallHistoryRecord[] = calls.map((call) => ({
          id: call.id,
          phoneNumber: call.phoneNumber || call.contact?.phoneNumber || 'N/A',
          name: call.name || (call.contact?.firstName && call.contact?.lastName 
            ? `${call.contact.firstName} ${call.contact.lastName}` 
            : call.contact?.firstName || ''),
          status: call.status?.toUpperCase() || 'UNKNOWN',
          dateTime: call.scheduledAt 
            ? new Date(call.scheduledAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(',', ' |')
            : 'Not scheduled',
          duration: call.durationSeconds 
            ? call.durationSeconds.toString() 
            : call.status === 'completed' ? 'N/A' : 'N/A',
      selected: false,
          type: call.type || 'outbound',
          startedAt: call.startedAt,
          endedAt: call.endedAt,
          durationSeconds: call.durationSeconds
        }))
        
        setCallHistory(transformedCalls)
        toast.success(`Loaded ${transformedCalls.length} call record(s)`)
      } catch (error) {
        console.error('Failed to fetch call history:', error)
        toast.error(`Failed to load call history: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setCallHistory([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCallHistory()
  }, [user, campaignId])

  const handleCheckboxChange = (recordId: string, checked: boolean) => {
    setCallHistory(callHistory.map((record) => (record.id === recordId ? { ...record, selected: checked } : record)))
    
    // Update selected count
    const newSelectedCount = callHistory.filter(record => 
      record.id === recordId ? checked : record.selected
    ).length
    setSelectedCount(newSelectedCount)
  }

  const handleSelectAll = (checked: boolean) => {
    setCallHistory(callHistory.map(record => ({ ...record, selected: checked })))
    setSelectedCount(checked ? callHistory.length : 0)
  }

  const handleRefresh = async () => {
    if (!user || !campaignId) return
    
    try {
      setIsLoading(true)
      // Clear cache to force fresh data
      callApi.clearCache(`campaign_${campaignId}`)
      
      const calls = await callApi.getByCampaign(campaignId, false)
      
      const transformedCalls: CallHistoryRecord[] = calls.map((call) => ({
        id: call.id,
        phoneNumber: call.phoneNumber || call.contact?.phoneNumber || 'N/A',
        name: call.name || (call.contact?.firstName && call.contact?.lastName 
          ? `${call.contact.firstName} ${call.contact.lastName}` 
          : call.contact?.firstName || ''),
        status: call.status?.toUpperCase() || 'UNKNOWN',
        dateTime: call.scheduledAt 
          ? new Date(call.scheduledAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).replace(',', ' |')
          : 'Not scheduled',
        duration: call.durationSeconds 
          ? call.durationSeconds.toString() 
          : call.status === 'completed' ? 'N/A' : 'N/A',
        selected: false,
        type: call.type || 'outbound',
        startedAt: call.startedAt,
        endedAt: call.endedAt,
        durationSeconds: call.durationSeconds
      }))
      
      setCallHistory(transformedCalls)
      setSelectedCount(0)
      toast.success('Call history refreshed')
    } catch (error) {
      console.error('Failed to refresh call history:', error)
      toast.error('Failed to refresh call history')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (selectedCount === 0) {
      toast.error('Please select calls to export')
      return
    }
    
    const selectedCalls = callHistory.filter(record => record.selected)
    
    // Create CSV content
    const headers = ['Phone Number', 'Name', 'Status', 'Date & Time', 'Duration (Sec)', 'Type']
    const csvContent = [
      headers.join(','),
      ...selectedCalls.map(call => [
        call.phoneNumber,
        call.name || '',
        call.status,
        call.dateTime,
        call.duration,
        call.type
      ].join(','))
    ].join('\n')
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `call-history-campaign-${campaignId}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success(`Exported ${selectedCount} call record(s)`)
  }

  const handleViewDetails = (recordId: string) => {
    router.push(`/campaigns/${campaignId}/info/call-history/${recordId}`)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case 'failed':
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case 'in_progress':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case 'scheduled':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case 'cancelled':
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
    }
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
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 2, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              className="cursor-pointer"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </motion.div>
            <span className="text-sm text-gray-500">
              {isLoading ? 'Loading...' : `${callHistory.length} record(s)`}
              {selectedCount > 0 && ` • ${selectedCount} selected`}
            </span>
          </div>
          <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleExport}
                disabled={selectedCount === 0}
                className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium flex items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="mr-2 h-4 w-4" />
                EXPORT ({selectedCount})
            </Button>
          </motion.div>
          </div>
        </motion.div>

        {/* Table Header */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-600"
        >
          <div className="col-span-1 flex items-center">
            <Checkbox
              checked={selectedCount === callHistory.length && callHistory.length > 0}
              onCheckedChange={handleSelectAll}
              className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333]"
            />
          </div>
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
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-2">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    </div>
                    <div className="col-span-1">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : callHistory.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg mb-4">No call history found for this campaign</div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-black text-black hover:bg-gray-100"
              >
                Refresh
              </Button>
            </motion.div>
          ) : (
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
                          className={getStatusBadgeClass(record.status)}
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
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

export default withAuth(CallHistoryPage)
