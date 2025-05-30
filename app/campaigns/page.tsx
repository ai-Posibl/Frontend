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
  toBeMade: number
  completed: number
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
      toBeMade: 150,
      completed: 50,
    },
    {
      id: 3,
      name: "ODD Media",
      createdBy: "Marketing Lead",
      createdOn: "10/04/2025",
      agent: "Riya-Wishfin v2 | Expert",
      scheduled: "10/04/2025",
      status: "ACTIVE",
      toBeMade: 300,
      completed: 0,
    },
  ])

  const handleCreateCampaign = () => {
    router.push("/create-campaign")
  }

  const handleCampaignClick = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-medium">All Campaigns</h1>
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">Last updated 5 mins ago</span>
          </div>
          <Button onClick={handleCreateCampaign} className="bg-black text-[#b5d333] hover:bg-gray-900 font-normal text-xs">
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
            ].map((stat) => (
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
                <div className="text-2xl font-medium">{stat.value}</div>
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
                    <Badge className="bg-[#b5d333] text-black text-xs font-normal">NEW</Badge>
                  </div>
                  <h3 className="text-base font-medium">Riya-Wishfin v2 | Expert</h3>
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
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-600">
          <div className="col-span-4">Campaigns</div>
          <div className="col-span-3">Agent</div>
          <div className="col-span-2">Scheduled</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-1">Status</div>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => handleCampaignClick(campaign.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <div>
                    <div className="font-medium text-base mb-1">{campaign.name}</div>
                    <div className="text-xs text-gray-500">Created by: {campaign.createdBy}</div>
                    <div className="text-xs text-gray-500">Created on: {campaign.createdOn}</div>
                  </div>
                </div>
                <div className="col-span-3">
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
                <div className="col-span-2 text-gray-600 text-xs">
                  {campaign.scheduled}
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 mb-1">
                    {campaign.completed} / {campaign.toBeMade + campaign.completed}
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#b5d333]"
                      style={{
                        width: `${(campaign.completed / (campaign.toBeMade + campaign.completed)) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
