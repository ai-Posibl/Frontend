"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, Search, RefreshCw, ChevronDown, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth, withAuth } from "@/hooks/use-auth"
import { campaignApi, callApi } from "@/lib/api"
import { toast } from "sonner"

interface CallRecord {
  id: string
  phoneNumber: string
  name?: string
  status: string
  selected: boolean
  type: string
  scheduledAt?: string
  startedAt?: string
  endedAt?: string
  durationSeconds?: number
  campaign?: any
  agent?: any
  contact?: any
}

interface CampaignInfo {
  id: string
  name: string
  description?: string
  status: string
  type: string
  agent?: any
  totalCalls: number
  completedCalls: number
  failedCalls: number
  averageDuration: number
  answerRate: number
}

function CampaignInfoPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [callRecords, setCallRecords] = useState<CallRecord[]>([])
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCount, setSelectedCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  
  const campaignId = params.id as string

  // Fetch campaign info and calls from backend
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!user || !campaignId) return

      try {
        setIsLoading(true)
        console.log(`Fetching campaign data for campaign ${campaignId}...`)
        
        // Fetch campaign details and calls in parallel
        const [campaign, calls] = await Promise.all([
          campaignApi.getById(campaignId),
          callApi.getByCampaign(campaignId)
        ])
        
        console.log('Campaign details fetched:', campaign)
        console.log('Campaign calls fetched:', calls)
        
        // Transform campaign data
        const transformedCampaign: CampaignInfo = {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          status: campaign.status,
          type: campaign.type,
          agent: campaign.agent,
          totalCalls: calls.length,
          completedCalls: calls.filter(call => call.status === 'completed').length,
          failedCalls: calls.filter(call => call.status === 'failed').length,
          averageDuration: calls.length > 0 
            ? Math.round(calls.reduce((sum, call) => sum + (call.durationSeconds || 0), 0) / calls.length)
            : 0,
          answerRate: calls.length > 0 
            ? Math.round((calls.filter(call => call.status === 'completed').length / calls.length) * 100)
            : 0
        }
        
        setCampaignInfo(transformedCampaign)
        
        // Transform call data
        const transformedCalls: CallRecord[] = calls.map((call) => ({
          id: call.id,
          phoneNumber: call.phoneNumber || call.contact?.phoneNumber || 'N/A',
          name: call.name || (call.contact?.firstName && call.contact?.lastName 
            ? `${call.contact.firstName} ${call.contact.lastName}` 
            : call.contact?.firstName || ''),
          status: call.status?.toUpperCase() || 'UNKNOWN',
      selected: false,
          type: call.type || 'outbound',
          scheduledAt: call.scheduledAt,
          startedAt: call.startedAt,
          endedAt: call.endedAt,
          durationSeconds: call.durationSeconds,
          campaign: call.campaign,
          agent: call.agent,
          contact: call.contact
        }))
        
        setCallRecords(transformedCalls)
        setLastUpdated(new Date())
        toast.success(`Loaded campaign info with ${transformedCalls.length} call record(s)`)
      } catch (error) {
        console.error('Failed to fetch campaign data:', error)
        toast.error(`Failed to load campaign data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setCampaignInfo(null)
        setCallRecords([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaignData()
  }, [user, campaignId])

  const handleRefresh = async () => {
    if (!user || !campaignId) return
    
    try {
      setIsLoading(true)
      
      // Clear caches to force fresh data
      callApi.clearCache(`campaign_${campaignId}`)
      
      const [campaign, calls] = await Promise.all([
        campaignApi.getById(campaignId),
        callApi.getByCampaign(campaignId, false)
      ])
      
      const transformedCampaign: CampaignInfo = {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        type: campaign.type,
        agent: campaign.agent,
        totalCalls: calls.length,
        completedCalls: calls.filter(call => call.status === 'completed').length,
        failedCalls: calls.filter(call => call.status === 'failed').length,
        averageDuration: calls.length > 0 
          ? Math.round(calls.reduce((sum, call) => sum + (call.durationSeconds || 0), 0) / calls.length)
          : 0,
        answerRate: calls.length > 0 
          ? Math.round((calls.filter(call => call.status === 'completed').length / calls.length) * 100)
          : 0
      }
      
      setCampaignInfo(transformedCampaign)
      
      const transformedCalls: CallRecord[] = calls.map((call) => ({
        id: call.id,
        phoneNumber: call.phoneNumber || call.contact?.phoneNumber || 'N/A',
        name: call.name || (call.contact?.firstName && call.contact?.lastName 
          ? `${call.contact.firstName} ${call.contact.lastName}` 
          : call.contact?.firstName || ''),
        status: call.status?.toUpperCase() || 'UNKNOWN',
      selected: false,
        type: call.type || 'outbound',
        scheduledAt: call.scheduledAt,
        startedAt: call.startedAt,
        endedAt: call.endedAt,
        durationSeconds: call.durationSeconds,
        campaign: call.campaign,
        agent: call.agent,
        contact: call.contact
      }))
      
      setCallRecords(transformedCalls)
      setSelectedCount(0)
      setLastUpdated(new Date())
      toast.success('Campaign data refreshed')
    } catch (error) {
      console.error('Failed to refresh campaign data:', error)
      toast.error('Failed to refresh campaign data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckboxChange = (recordId: string, checked: boolean) => {
    setCallRecords(callRecords.map((record) => (record.id === recordId ? { ...record, selected: checked } : record)))
    
    // Update selected count
    const newSelectedCount = callRecords.filter(record => 
      record.id === recordId ? checked : record.selected
    ).length
    setSelectedCount(newSelectedCount)
  }

  const handleSelectAll = (checked: boolean) => {
    setCallRecords(callRecords.map(record => ({ ...record, selected: checked })))
    setSelectedCount(checked ? callRecords.length : 0)
  }

  const handleExport = () => {
    if (selectedCount === 0) {
      toast.error('Please select calls to export')
      return
    }
    
    const selectedCalls = callRecords.filter(record => record.selected)
    
    // Create CSV content
    const headers = ['Phone Number', 'Name', 'Status', 'Type', 'Scheduled At', 'Duration (Sec)']
    const csvContent = [
      headers.join(','),
      ...selectedCalls.map(call => [
        call.phoneNumber,
        call.name || '',
        call.status,
        call.type,
        call.scheduledAt || '',
        call.durationSeconds || ''
      ].join(','))
    ].join('\n')
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaign-info-${campaignId}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success(`Exported ${selectedCount} call record(s)`)
  }

  const handleViewData = (recordId: string) => {
    console.log("Viewing data for record:", recordId)
    // Could navigate to call details or show a modal with call data
    router.push(`/campaigns/${campaignId}/info/call-history/${recordId}`)
  }

  const handleCallHistory = (recordId: string) => {
    // Navigate to call history page
    router.push(`/campaigns/${campaignId}/info/call-history`)
  }

  // Filter call records based on search query
  const filteredCallRecords = callRecords.filter(record =>
    record.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (record.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <span className="text-gray-900 font-medium">Info</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">
              {isLoading ? 'Loading...' : campaignInfo?.name || 'Campaign Info'}
            </h1>
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 2, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              className="cursor-pointer"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </motion.div>
            <span className="text-sm text-gray-500">
              {isLoading ? 'Loading...' : `Last updated ${lastUpdated.toLocaleTimeString()}`}
              {selectedCount > 0 && ` • ${selectedCount} selected`}
            </span>
          </div>
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
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: Phone, 
              label: "Calls Made", 
              value: isLoading ? "..." : campaignInfo?.totalCalls.toString() || "0", 
              subtitle: `Out of ${campaignInfo?.totalCalls || 0}`, 
              color: "yellow" 
            },
            { 
              icon: MessageSquare, 
              label: "Answer Rate", 
              value: isLoading ? "..." : `${campaignInfo?.answerRate || 0} %`, 
              subtitle: "", 
              color: "blue" 
            },
            { 
              icon: Phone, 
              label: "Avg. Call Duration", 
              value: isLoading ? "..." : campaignInfo?.averageDuration.toString() || "0", 
              subtitle: "sec", 
              color: "red" 
            },
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
          <div className="col-span-1">
            <Checkbox
              checked={selectedCount === callRecords.length && callRecords.length > 0}
              onCheckedChange={handleSelectAll}
              className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333]"
            />
          </div>
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
                    <div className="col-span-3">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-3">
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : filteredCallRecords.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg mb-4">
                {searchQuery ? 'No call records found matching your search' : 'No call records found for this campaign'}
              </div>
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
              {filteredCallRecords.map((record, index) => (
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
                        {record.name && (
                          <div className="text-sm text-gray-500">{record.name}</div>
                        )}
                    </motion.span>
                  </div>
                  <div className="col-span-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                        <Badge className={getStatusBadgeClass(record.status)}>
                          {record.status}
                        </Badge>
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
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

export default withAuth(CampaignInfoPage)
