"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MessageSquare,
  CheckCircle,
  Activity,
  Pause,
  Search,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth, withAuth } from "@/hooks/use-auth"
import { campaignApi, callApi, Campaign as APICampaign } from "@/lib/api"
import { toast } from "sonner"

interface Campaign extends APICampaign {
  selected: boolean
  expanded: boolean
  toBeMade?: number
  completed?: number
  callsCount?: number
  createdOn: string
  scheduled: string
}

interface CampaignStats {
  total: number
  completed: number
  active: number
  paused: number
}

function CampaignsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<CampaignStats>({
    total: 0,
    completed: 0,
    active: 0,
    paused: 0
  })

  // Fetch campaigns from backend
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        console.log('Fetching campaigns from backend...')
        
        const campaignsData = await campaignApi.getAll()
        console.log('Campaigns fetched successfully:', campaignsData)
        
        if (Array.isArray(campaignsData)) {
          // Get call statistics for all campaigns in one batch to avoid repeated API calls
          const campaignIds = campaignsData.map(c => c.id)
          const callStats = await callApi.getBatchCampaignStats(campaignIds)
          
          // Transform backend data to match frontend interface
          const transformedCampaigns: Campaign[] = campaignsData.map((campaign) => {
            const stats = callStats[campaign.id] || { total: 0, completed: 0 }
            
            return {
              ...campaign,
      selected: false,
      expanded: false,
              toBeMade: stats.total - stats.completed,
              completed: stats.completed,
              callsCount: stats.total,
              // Set computed display fields
              createdOn: campaign.createdAt,
              scheduled: campaign.startDate || campaign.createdAt
            }
          })
          
          setCampaigns(transformedCampaigns)
          
          // Calculate stats
          const newStats = {
            total: transformedCampaigns.length,
            completed: transformedCampaigns.filter(c => c.status === 'completed').length,
            active: transformedCampaigns.filter(c => c.status === 'active').length,
            paused: transformedCampaigns.filter(c => c.status === 'paused').length
          }
          setStats(newStats)
          
          toast.success(`Loaded ${transformedCampaigns.length} campaign(s)`)
        } else {
          console.log('No campaigns found or invalid response format')
          setCampaigns([])
          toast.info('No campaigns found')
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
        toast.error(`Failed to load campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setCampaigns([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [user])

  const handleCreateCampaign = () => {
    router.push("/create-campaign")
  }

  const handleCampaignClick = (campaignId: string) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, expanded: !campaign.expanded } : campaign,
      ),
    )
  }

  const handleCheckboxChange = (campaignId: string, checked: boolean) => {
    setCampaigns(
      campaigns.map((campaign) => (campaign.id === campaignId ? { ...campaign, selected: checked } : campaign)),
    )
  }

  const handleInfoClick = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}/info`)
  }

  const handleRefresh = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      // Clear caches to force fresh data
      callApi.clearCache()
      
      const campaignsData = await campaignApi.getAll()
      
      if (Array.isArray(campaignsData)) {
        // Get call statistics for all campaigns in one batch
        const campaignIds = campaignsData.map(c => c.id)
        const callStats = await callApi.getBatchCampaignStats(campaignIds)
        
        const transformedCampaigns: Campaign[] = campaignsData.map((campaign) => {
          const stats = callStats[campaign.id] || { total: 0, completed: 0 }
          
          return {
            ...campaign,
            selected: false,
            expanded: false,
            toBeMade: stats.total - stats.completed,
            completed: stats.completed,
            callsCount: stats.total,
            // Set computed display fields
            createdOn: campaign.createdAt,
            scheduled: campaign.startDate || campaign.createdAt
          }
        })
        
        setCampaigns(transformedCampaigns)
        
        const newStats = {
          total: transformedCampaigns.length,
          completed: transformedCampaigns.filter(c => c.status === 'completed').length,
          active: transformedCampaigns.filter(c => c.status === 'active').length,
          paused: transformedCampaigns.filter(c => c.status === 'paused').length
        }
        setStats(newStats)
        
        toast.success('Campaigns refreshed')
      }
    } catch (error) {
      console.error('Failed to refresh campaigns:', error)
      toast.error('Failed to refresh campaigns')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (campaign.agent?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return "bg-[#b5d333] text-black hover:bg-[#b5d333]"
      case 'paused':
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case 'completed':
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
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
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">All Campaigns</h1>
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 2, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              className="cursor-pointer"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </motion.div>
            <span className="text-sm text-gray-500">
              {isLoading ? 'Loading...' : `Last updated ${new Date().toLocaleTimeString()}`}
            </span>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCreateCampaign}
              className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium transition-all duration-200"
            >
              + CREATE CAMPAIGN
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards and Agent Banner */}
        <motion.div variants={itemVariants} className="flex gap-6">
          {/* Stats Cards */}
          <div className="flex-1 grid grid-cols-4 gap-4">
            {[
              { icon: MessageSquare, label: "Total", value: stats.total.toString(), color: "yellow" },
              { icon: CheckCircle, label: "Completed", value: stats.completed.toString(), color: "green" },
              { icon: Activity, label: "Active", value: stats.active.toString(), color: "lime" },
              { icon: Pause, label: "Paused", value: stats.paused.toString(), color: "red" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    className={`p-2 rounded-lg ${
                      stat.color === "yellow"
                        ? "bg-yellow-100"
                        : stat.color === "green"
                          ? "bg-green-100"
                          : stat.color === "lime"
                            ? "bg-[#b5d333] bg-opacity-20"
                            : "bg-red-100"
                    }`}
                  >
                    <stat.icon
                      className={`h-5 w-5 ${
                        stat.color === "yellow"
                          ? "text-yellow-600"
                          : stat.color === "green"
                            ? "text-green-600"
                            : stat.color === "lime"
                              ? "text-[#b5d333]"
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
                  className="text-3xl font-bold"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      className="h-8 w-8 bg-gray-200 rounded"
                    />
                  ) : (
                    stat.value
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Agent Banner */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="w-80">
            <div className="relative rounded-xl overflow-hidden h-full">
              <Image
                src="/agent-banner-bg.png"
                alt="Agent Banner Background"
                width={320}
                height={120}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 p-6 flex items-center justify-between text-white">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">Agent</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    >
                      <Badge className="bg-[#b5d333] text-black text-xs font-medium">NEW</Badge>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold">Riya-Wishfin v2 | Expert</h3>
                </motion.div>
              </div>
            </div>
          </motion.div>
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
          <div className="col-span-4">Campaigns</div>
          <div className="col-span-3">Agent</div>
          <div className="col-span-2">Scheduled</div>
          <div className="col-span-1 flex items-center">
            Status
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-1">Actions</div>
        </motion.div>

        {/* Campaigns List */}
        <motion.div variants={itemVariants} className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-4 space-y-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                    <div className="col-span-3">
                      <div className="h-10 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="col-span-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-1">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-1">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg mb-4">
                {searchQuery ? 'No campaigns found matching your search' : 'No campaigns created yet'}
              </div>
              {!searchQuery && (
                <Button
                  onClick={handleCreateCampaign}
                  className="bg-black text-[#b5d333] hover:bg-gray-900"
                >
                  Create Your First Campaign
                </Button>
              )}
            </motion.div>
          ) : (
          <AnimatePresence>
              {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <motion.div
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleCampaignClick(campaign.id)}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="col-span-1 flex items-center">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Checkbox
                        checked={campaign.selected}
                        onCheckedChange={(checked) => handleCheckboxChange(campaign.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333] transition-all duration-200"
                      />
                    </motion.div>
                  </div>
                  <div className="col-span-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <div className="font-semibold text-lg mb-1">{campaign.name}</div>
                        <div className="text-sm text-gray-500">
                          Created by: {campaign.createdBy?.firstName && campaign.createdBy?.lastName 
                            ? `${campaign.createdBy.firstName} ${campaign.createdBy.lastName}` 
                            : campaign.createdBy?.email || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">Created on: {formatDate(campaign.createdOn)}</div>
                    </motion.div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <motion.div
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Image
                          src="/placeholder.svg?height=40&width=40&query=smiling woman with brown hair"
                          alt="Agent"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </motion.div>
                        <span className="font-medium">{campaign.agent?.name}</span>
                    </motion.div>
                  </div>
                    <div className="col-span-2 flex items-center text-gray-600">{formatDate(campaign.scheduled)}</div>
                  <div className="col-span-1 flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                          className={getStatusBadgeClass(campaign.status)}
                      >
                        {campaign.status}
                      </Badge>
                    </motion.div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleInfoClick(campaign.id)
                        }}
                        className="hover:bg-gray-200 transition-all duration-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {campaign.expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="px-6 pb-6 pt-2"
                      >
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-1"></div>
                          <div className="col-span-4">
                            <div className="flex space-x-8">
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                              >
                                <div className="text-sm text-gray-500">To Be Made</div>
                                <div className="text-2xl font-bold">{campaign.toBeMade}</div>
                              </motion.div>
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                              >
                                <div className="text-sm text-gray-500">Completed</div>
                                <div className="text-2xl font-bold">{campaign.completed}</div>
                              </motion.div>
                            </div>
                          </div>
                          <div className="col-span-7"></div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

export default withAuth(CampaignsPage)
