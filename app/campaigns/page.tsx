"use client"

import { useState } from "react"
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

interface Campaign {
  id: number
  name: string
  createdBy: string
  createdOn: string
  agent: string
  scheduled: string
  status: "ACTIVE" | "PAUSED" | "COMPLETED"
  selected: boolean
  expanded: boolean
  toBeMade?: number
  completed?: number
}

export default function CampaignsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "ODD Media",
      createdBy: "Marketing Lead",
      createdOn: "10/04/2025",
      agent: "Riya-Wishfin v2 | Expert",
      scheduled: "10/04/2025",
      status: "ACTIVE",
      selected: false,
      expanded: true,
      toBeMade: 238,
      completed: 62,
    },
    {
      id: 2,
      name: "ODD Media",
      createdBy: "Marketing Lead",
      createdOn: "10/04/2025",
      agent: "Riya-Wishfin v2 | Expert",
      scheduled: "10/04/2025",
      status: "PAUSED",
      selected: true,
      expanded: false,
    },
    {
      id: 3,
      name: "ODD Media",
      createdBy: "Marketing Lead",
      createdOn: "10/04/2025",
      agent: "Riya-Wishfin v2 | Expert",
      scheduled: "10/04/2025",
      status: "ACTIVE",
      selected: false,
      expanded: false,
    },
    {
      id: 4,
      name: "ODD Media",
      createdBy: "Marketing Lead",
      createdOn: "10/04/2025",
      agent: "Riya-Wishfin v2 | Expert",
      scheduled: "10/04/2025",
      status: "ACTIVE",
      selected: false,
      expanded: false,
    },
  ])

  const handleCreateCampaign = () => {
    router.push("/create-campaign")
  }

  const handleCampaignClick = (campaignId: number) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, expanded: !campaign.expanded } : campaign,
      ),
    )
  }

  const handleCheckboxChange = (campaignId: number, checked: boolean) => {
    setCampaigns(
      campaigns.map((campaign) => (campaign.id === campaignId ? { ...campaign, selected: checked } : campaign)),
    )
  }

  const handleInfoClick = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}/info`)
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
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </motion.div>
            <span className="text-sm text-gray-500">Last updated 5 mins ago</span>
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
              { icon: MessageSquare, label: "Total", value: "67", color: "yellow" },
              { icon: CheckCircle, label: "Completed", value: "28", color: "green" },
              { icon: Activity, label: "Active", value: "30", color: "lime" },
              { icon: Pause, label: "Paused", value: "2", color: "red" },
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
                  {stat.value}
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
          <AnimatePresence>
            {campaigns.map((campaign, index) => (
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
                      <div className="text-sm text-gray-500">Created by: {campaign.createdBy}</div>
                      <div className="text-sm text-gray-500">Created on: {campaign.createdOn}</div>
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
                      <span className="font-medium">{campaign.agent}</span>
                    </motion.div>
                  </div>
                  <div className="col-span-2 flex items-center text-gray-600">{campaign.scheduled}</div>
                  <div className="col-span-1 flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        className={
                          campaign.status === "ACTIVE"
                            ? "bg-[#b5d333] text-black hover:bg-[#b5d333]"
                            : campaign.status === "PAUSED"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
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
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
