"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Agent {
  id: string
  name: string
  description: string
  image: string
  language: string
  isNew?: boolean
}

export default function AgentsPage() {
  const [playingAgent, setPlayingAgent] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [variableName, setVariableName] = useState("CompanyName")
  const [variableValue, setVariableValue] = useState("Posibl AI")
  const [variableType, setVariableType] = useState("string")

  const router = useRouter()

  const agents: Agent[] = [
    {
      id: "riya-wishfin-1",
      name: "Riya-Wishfin",
      description:
        "Riya is a conversational AI agent for Wishfin that chats in Indian English or Hinglish to offer pre-approved Tata Capital personal loans and assist with the application.",
      image: "/placeholder.svg?height=120&width=120",
      language: "British",
      isNew: true,
    },
    {
      id: "john-phonepe-1",
      name: "John-phonepe",
      description:
        "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
      image: "/placeholder.svg?height=120&width=120",
      language: "British",
    },
    {
      id: "john-phonepe-2",
      name: "John-phonepe",
      description:
        "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
      image: "/placeholder.svg?height=120&width=120",
      language: "British",
    },
    {
      id: "riya-wishfin-2",
      name: "Riya-Wishfin",
      description:
        "Riya is a conversational AI agent for Wishfin that chats in Indian English or Hinglish to offer pre-approved Tata Capital personal loans and assist with the application.",
      image: "/placeholder.svg?height=120&width=120",
      language: "British",
    },
    {
      id: "riya-wishfin-3",
      name: "Riya-Wishfin",
      description:
        "Riya is a conversational AI agent for Wishfin that chats in Indian English or Hinglish to offer pre-approved Tata Capital personal loans and assist with the application.",
      image: "/placeholder.svg?height=120&width=120",
      language: "British",
    },
    {
      id: "john-phonepe-3",
      name: "John-phonepe",
      description:
        "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
      image: "/placeholder.svg?height=120&width=120",
      language: "British",
    },
  ]

  const handlePlayVoiceSample = (agentId: string) => {
    if (playingAgent === agentId) {
      setPlayingAgent(null)
    } else {
      setPlayingAgent(agentId)
      // Simulate stopping after 3 seconds
      setTimeout(() => {
        setPlayingAgent(null)
      }, 3000)
    }
  }

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsDrawerOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold">Agents</h1>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent, index) => (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {/* Agent Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      width={120}
                      height={120}
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  </div>
                </div>

                {/* Agent Details */}
                <div className="flex-1 min-w-0">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-base font-bold text-gray-900">{agent.name}</h3>
                      {agent.isNew && (
                        <Badge className="bg-[#b5d333] text-black hover:bg-[#b5d333] text-xs font-medium">NEW</Badge>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{agent.description}</p>

                    {/* Voice Sample Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handlePlayVoiceSample(agent.id)}
                          className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800"
                        >
                          <Play className="h-4 w-4 ml-0.5" />
                        </button>
                        <span className="text-xs text-gray-600">Voice Sample</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src="/placeholder.svg?height=20&width=20"
                          alt="British Flag"
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                        <span className="text-xs text-gray-600">{agent.language}</span>
                      </div>
                    </div>

                    {/* Playing Indicator */}
                    {playingAgent === agent.id && (
                      <div className="mt-3 overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-1 h-3 bg-[#b5d333] rounded-full"
                                style={{
                                  animation: `pulse 1s ease-in-out ${i * 0.1}s infinite`,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">Playing voice sample...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Info Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[500px] sm:w-[500px] overflow-y-auto">
          {selectedAgent && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">{selectedAgent.name}</h2>
              </div>

              {/* Agent Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Agent Tag:</label>
                    <div className="font-medium text-xs">Customer Service Pro</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Agent ID:</label>
                    <div className="font-medium text-xs">AGT-007</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Date of Creation:</label>
                    <div className="font-medium text-xs">2025-01-15</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Language:</label>
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/placeholder.svg?height=20&width=20"
                        alt="British Flag"
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                      <span className="font-medium text-xs">{selectedAgent.language}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-700 leading-relaxed">{selectedAgent.description}</p>
                </div>
              </div>

              {/* Tool Used */}
              <div>
                <h3 className="font-medium text-sm mb-3">Tool Used</h3>
                <div className="flex flex-wrap gap-2">
                  {["WhatsApp", "Transfer", "RAG", "Order Lookup"].map((tool) => (
                    <Badge key={tool} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-medium text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Simplified Variables Section */}
              <div>
                <h3 className="font-medium text-sm mb-4">Variable Configuration</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="variable-name" className="text-xs font-medium text-gray-700">
                      Variable Name
                    </Label>
                    <Input
                      id="variable-name"
                      value={variableName}
                      onChange={(e) => setVariableName(e.target.value)}
                      placeholder="Enter variable name"
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="variable-value" className="text-xs font-medium text-gray-700">
                      Variable Value
                    </Label>
                    <Input
                      id="variable-value"
                      value={variableValue}
                      onChange={(e) => setVariableValue(e.target.value)}
                      placeholder="Enter variable value"
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="variable-type" className="text-xs font-medium text-gray-700">
                      Variable Type
                    </Label>
                    <Select value={variableType} onValueChange={setVariableType}>
                      <SelectTrigger className="mt-1 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string" className="text-xs">String</SelectItem>
                        <SelectItem value="number" className="text-xs">Number</SelectItem>
                        <SelectItem value="boolean" className="text-xs">Boolean</SelectItem>
                        <SelectItem value="array" className="text-xs">Array</SelectItem>
                        <SelectItem value="object" className="text-xs">Object</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-xs"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    setIsDrawerOpen(false)
                    router.push("/create-campaign")
                  }}
                  className="flex-1 h-12 bg-black text-[#b5d333] hover:bg-gray-900 font-medium text-xs"
                >
                  CREATE CAMPAIGN
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  )
}
