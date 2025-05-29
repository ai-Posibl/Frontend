"use client"

import { useState } from "react"
import  DashboardLayout  from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
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
      image: "/placeholder.svg?height=120&width=120&query=smiling woman with brown hair",
      language: "British",
      isNew: true,
    },
    {
      id: "john-phonepe-1",
      name: "John-phonepe",
      description:
        "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
      image: "/placeholder.svg?height=120&width=120&query=serious man with dark hair",
      language: "British",
    },
    {
      id: "john-phonepe-2",
      name: "John-phonepe",
      description:
        "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
      image: "/placeholder.svg?height=120&width=120&query=serious man with dark hair",
      language: "British",
    },
    {
      id: "riya-wishfin-2",
      name: "Riya-Wishfin",
      description:
        "Riya is a conversational AI agent for Wishfin that chats in Indian English or Hinglish to offer pre-approved Tata Capital personal loans and assist with the application.",
      image: "/placeholder.svg?height=120&width=120&query=smiling woman with brown hair",
      language: "British",
    },
    {
      id: "riya-wishfin-3",
      name: "Riya-Wishfin",
      description:
        "Riya is a conversational AI agent for Wishfin that chats in Indian English or Hinglish to offer pre-approved Tata Capital personal loans and assist with the application.",
      image: "/placeholder.svg?height=120&width=120&query=smiling woman with brown hair",
      language: "British",
    },
    {
      id: "john-phonepe-3",
      name: "John-phonepe",
      description:
        "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
      image: "/placeholder.svg?height=120&width=120&query=serious man with dark hair",
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
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl font-bold">Agents</h1>
        </motion.div>

        {/* Agents Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => handleAgentClick(agent)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {/* Agent Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <Image
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      width={120}
                      height={120}
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  </div>
                </motion.div>

                {/* Agent Details */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                      {agent.isNew && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                        >
                          <Badge className="bg-[#b5d333] text-black hover:bg-[#b5d333] text-xs font-medium">NEW</Badge>
                        </motion.div>
                      )}
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="text-gray-600 text-sm leading-relaxed mb-4"
                    >
                      {agent.description}
                    </motion.p>

                    {/* Voice Sample Controls */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <motion.button
                          onClick={() => handlePlayVoiceSample(agent.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                        >
                          <Play className="h-4 w-4 ml-0.5" />
                        </motion.button>
                        <span className="text-sm text-gray-600">Voice Sample</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src="/placeholder.svg?height=20&width=20&query=british flag"
                          alt="British Flag"
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                        <span className="text-sm text-gray-600">{agent.language}</span>
                      </div>
                    </motion.div>

                    {/* Playing Indicator */}
                    <AnimatePresence>
                      {playingAgent === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{
                                    scaleY: [1, 2, 1],
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.1,
                                  }}
                                  className="w-1 h-3 bg-[#b5d333] rounded-full"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">Playing voice sample...</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Agent Info Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[500px] sm:w-[500px] overflow-y-auto">
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
              </div>

              {/* Agent Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Agent Tag:</label>
                    <div className="font-medium">Customer Service Pro</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Agent ID:</label>
                    <div className="font-medium">AGT-007</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Date of Creation:</label>
                    <div className="font-medium">2025-01-15</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Language:</label>
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/placeholder.svg?height=20&width=20&query=british flag"
                        alt="British Flag"
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                      <span className="font-medium">{selectedAgent.language}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedAgent.description}</p>
                </div>
              </div>

              {/* Tool Used */}
              <div>
                <h3 className="font-medium mb-3">Tool Used</h3>
                <div className="flex flex-wrap gap-2">
                  {["WhatsApp", "Transfer", "RAG", "Order Lookup"].map((tool) => (
                    <Badge key={tool} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-medium">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Simplified Variables Section */}
              <div>
                <h3 className="font-medium mb-4">Variable Configuration</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="variable-name" className="text-sm font-medium text-gray-700">
                      Variable Name
                    </Label>
                    <Input
                      id="variable-name"
                      value={variableName}
                      onChange={(e) => setVariableName(e.target.value)}
                      placeholder="Enter variable name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="variable-value" className="text-sm font-medium text-gray-700">
                      Variable Value
                    </Label>
                    <Input
                      id="variable-value"
                      value={variableValue}
                      onChange={(e) => setVariableValue(e.target.value)}
                      placeholder="Enter variable value"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="variable-type" className="text-sm font-medium text-gray-700">
                      Variable Type
                    </Label>
                    <Select value={variableType} onValueChange={setVariableType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
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
                  className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    setIsDrawerOpen(false)
                    router.push("/create-campaign")
                  }}
                  className="flex-1 h-12 bg-black text-[#b5d333] hover:bg-gray-900 font-medium"
                >
                  CREATE CAMPAIGN
                </Button>
              </div>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  )
}