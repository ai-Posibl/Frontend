"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

interface Campaign {
  id: number
  name: string
  createdBy: string
  createdOn: string
  agent: string
  scheduled: string
  status: "ACTIVE" | "PAUSED" | "COMPLETED"
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

  const handleInfoClick = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}/info`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">All Campaigns</h1>
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">Last updated 5 mins ago</span>
          </div>
          <Button onClick={handleCreateCampaign} className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium text-xs">
            + CREATE CAMPAIGN
          </Button>
        </div>

        {/* Stats Cards and Agent Banner */}
        <div className="flex gap-6">
          {/* Stats Cards */}
          <div className="flex-1 grid grid-cols-4 gap-4">
            {[
              { icon: MessageSquare, label: "Total", value: "67", color: "yellow" },
              { icon: CheckCircle, label: "Completed", value: "28", color: "green" },
              { icon: Activity, label: "Active", value: "30", color: "lime" },
              { icon: Pause, label: "Paused", value: "2", color: "red" },
            ].map((stat, index) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md">
                <div className="flex items-center space-x-3 mb-3">
                  <div
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
                  </div>
                  <span className="text-gray-600 font-medium text-xs">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Agent Banner */}
          <div className="w-80">
            <div className="relative rounded-xl overflow-hidden h-full">
              <Image
                src="/agent-banner-bg.png"
                alt="Agent Banner Background"
                width={320}
                height={120}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 p-6 flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs">Agent</span>
                    <Badge className="bg-[#b5d333] text-black text-xs font-medium">NEW</Badge>
                  </div>
                  <h3 className="text-base font-bold">Riya-Wishfin v2 | Expert</h3>
                </div>
              </div>
            </div>
          </div>
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
        <div className="grid grid-cols-11 gap-4 px-6 py-3 text-xs font-medium text-gray-600">
          <div className="col-span-4">Campaigns</div>
          <div className="col-span-3">Agent</div>
          <div className="col-span-2">Scheduled</div>
          <div className="col-span-1 flex items-center">
            Status
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md"
            >
              <div
                className="grid grid-cols-11 gap-4 p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCampaignClick(campaign.id)}
              >
                <div className="col-span-4">
                  <div>
                    <div className="font-semibold text-base mb-1">{campaign.name}</div>
                    <div className="text-xs text-gray-500">Created by: {campaign.createdBy}</div>
                    <div className="text-xs text-gray-500">Created on: {campaign.createdOn}</div>
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Agent"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium text-xs">{campaign.agent}</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-gray-600 text-xs">{campaign.scheduled}</div>
                <div className="col-span-1 flex items-center">
                  <Badge
                    className={
                      campaign.status === "ACTIVE"
                        ? "bg-[#b5d333] text-black hover:bg-[#b5d333] text-xs"
                        : campaign.status === "PAUSED"
                          ? "bg-red-100 text-red-800 hover:bg-red-100 text-xs"
                          : "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <div className="col-span-1 flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleInfoClick(campaign.id)
                    }}
                    className="hover:bg-gray-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              {campaign.expanded && (
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2">
                    <div className="grid grid-cols-11 gap-4">
                      <div className="col-span-4">
                        <div className="flex space-x-8">
                          <div>
                            <div className="text-xs text-gray-500">To Be Made</div>
                            <div className="text-xl font-bold">{campaign.toBeMade}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Completed</div>
                            <div className="text-xl font-bold">{campaign.completed}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-7"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
