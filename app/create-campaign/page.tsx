"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MUIDatePicker, MUITimePicker } from "@/components/ui/mui-date-time-picker"
import { CSVUploader } from "@/components/ui/csv-uploader"
import { CheckCircle, Play, ArrowLeft, Download } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { TestCallModal } from "@/components/test-call-modal"
import { motion } from "framer-motion"

// Sample voice agents data
const voiceAgents = [
  {
    id: "riya-wishfin",
    name: "Riya-Wishfin",
    description:
      "Riya is a conversational AI agent for Wishfin that chats in Indian English or Hinglish to offer pre-approved Tata Capital personal loans and assist with the application.",
    image: "/placeholder.svg?height=80&width=80&query=smiling woman with brown hair",
    language: "British",
  },
  {
    id: "john-phonepe",
    name: "John-phonepe",
    description:
      "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
    image: "/placeholder.svg?height=80&width=80&query=serious man with dark hair",
    language: "British",
  },
  {
    id: "sarah-banking",
    name: "Sarah-Banking",
    description:
      "Sarah specializes in banking services. She helps customers understand different account options, credit cards, and investment opportunities with a friendly and professional approach.",
    image: "/placeholder.svg?height=80&width=80&query=professional woman with blonde hair",
    language: "American",
  },
  {
    id: "raj-insurance",
    name: "Raj-Insurance",
    description:
      "Raj is an insurance specialist who explains policy details, coverage options, and helps customers find the right insurance plan for their needs with clear and simple explanations.",
    image: "/placeholder.svg?height=80&width=80&query=indian man with glasses",
    language: "Indian",
  },
]

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 state - Campaign Name and Agent Selection
  const [campaignName, setCampaignName] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("riya-wishfin")

  // Step 2 state - Campaign Configuration
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [concurrentCalls, setConcurrentCalls] = useState("0")

  const [showTestCallModal, setShowTestCallModal] = useState(false)

  const handleClose = () => {
    router.push("/")
  }

  const handleSaveDraft = () => {
    // Save draft data to localStorage
    const draftData = {
      campaignName,
      selectedAgent,
      selectedDate: selectedDate?.toISOString(),
      selectedTime,
      csvFileName: csvFile?.name,
      concurrentCalls,
      currentStep,
      savedAt: new Date().toISOString(),
    }

    localStorage.setItem("campaignDraft", JSON.stringify(draftData))

    console.log("Draft saved:", draftData)
    router.push("/")
  }

  const handleContinue = () => {
    // Move to step 2
    setCurrentStep(2)
  }

  const handleBack = () => {
    // Move back to step 1
    setCurrentStep(1)
  }

  const handleTestCampaign = () => {
    setShowTestCallModal(true)
  }

  const handleMakeTestCall = (testData: any) => {
    console.log("Making test call with data:", testData)

    // Save campaign data
    const campaignData = {
      campaignName,
      selectedAgent,
      selectedDate: selectedDate?.toISOString(),
      selectedTime,
      csvFileName: csvFile?.name,
      concurrentCalls,
      status: "testing",
      createdAt: new Date().toISOString(),
      testCallData: testData,
    }

    localStorage.setItem("campaignData", JSON.stringify(campaignData))

    // Show success message or navigate
    alert("Test call initiated successfully!")
    router.push("/")
  }

  const handleDownloadTemplate = () => {
    // Create a sample CSV content
    const csvContent =
      "Name,Phone,Email,Age\nJohn Doe,+1234567890,john@example.com,30\nJane Smith,+0987654321,jane@example.com,25"

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "campaign_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center p-4">
          <motion.button
            onClick={currentStep === 1 ? () => router.back() : handleBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center text-black font-medium hover:text-gray-700 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK
          </motion.button>
          <button onClick={handleClose} className="text-black font-medium hover:text-gray-700 text-sm">
            CLOSE
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center py-8">
        <div className="w-full max-w-2xl px-6">
          <h1 className="text-xl font-bold mb-8 text-center">Create Campaign</h1>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                ${currentStep >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {currentStep > 1 ? <CheckCircle className="h-5 w-5 text-[#b5d333]" /> : "1"}
            </div>
            <div
              className={`h-[2px] w-32 mx-4 transition-all duration-300 ${currentStep > 1 ? "bg-black" : "bg-gray-300"}`}
            ></div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                ${currentStep === 2 ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
            >
              2
            </div>
          </div>

          {currentStep === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="mb-6 text-gray-700 text-sm text-center">
                Start by naming your campaign and selecting your AI agent.
              </p>

              <div className="space-y-6">
                {/* Campaign Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Campaign Name</label>
                  <Input
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Enter campaign name"
                    className="w-full h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0 text-xs"
                  />
                </div>

                {/* Agent Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-4">Select AI Agent</label>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {voiceAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedAgent === agent.id ? "ring-2 ring-[#b5d333] bg-[#f8faed]" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <Image
                              src={agent.image || "/placeholder.svg"}
                              alt={agent.name}
                              width={60}
                              height={60}
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-base font-bold">{agent.name}</h3>
                              <Checkbox
                                checked={selectedAgent === agent.id}
                                onCheckedChange={() => setSelectedAgent(agent.id)}
                                className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333]"
                              />
                            </div>
                            <p className="text-xs text-gray-700 mt-2 mb-3">{agent.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <button className="flex items-center bg-black text-white rounded-full p-2 mr-3">
                                  <Play className="h-3 w-3" />
                                </button>
                                <span className="text-xs text-gray-600">Voice Sample</span>
                              </div>
                              <div className="flex items-center">
                                <Image
                                  src={`/placeholder.svg?height=16&width=16&query=${agent.language} flag`}
                                  alt={agent.language}
                                  width={16}
                                  height={16}
                                  className="mr-2"
                                />
                                <span className="text-xs text-gray-600">{agent.language}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="border-black text-black hover:bg-gray-100 hover:text-black rounded-md h-12 px-6 w-full font-medium text-xs"
                  >
                    SAVE DRAFT
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={!campaignName.trim()}
                    className="bg-black text-[#b5d333] hover:bg-gray-900 rounded-md h-12 px-6 w-full font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    CONTINUE
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="mb-6 text-gray-700 text-sm text-center">
                Configure your campaign settings and upload your contact list.
              </p>

              <div className="space-y-6">
                {/* Campaign Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-sm text-gray-900 mb-2">Campaign Summary</h3>
                  <div className="text-xs text-gray-600">
                    <p>
                      <strong>Name:</strong> {campaignName}
                    </p>
                    <p>
                      <strong>Agent:</strong> {voiceAgents.find((agent) => agent.id === selectedAgent)?.name}
                    </p>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-3">Schedule Campaign</label>
                  <div className="grid grid-cols-2 gap-4">
                    <MUIDatePicker date={selectedDate} setDate={setSelectedDate} placeholder="Select Date" />
                    <MUITimePicker time={selectedTime} setTime={setSelectedTime} placeholder="Select Time" />
                  </div>
                </div>

                {/* CSV Upload */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-medium text-gray-700">Upload Contact List</label>
                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="text-xs h-8 px-3">
                      <Download className="h-3 w-3 mr-1" />
                      Download Template
                    </Button>
                  </div>
                  <CSVUploader onFileChange={setCsvFile} />
                </div>

                {/* Concurrent Calls */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-3">Campaign Settings</label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div>
                      <div className="font-medium text-sm text-gray-900">Total Concurrent Calls</div>
                      <div className="text-xs text-gray-600">Maximum: 5 calls</div>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={concurrentCalls}
                      onChange={(e) => setConcurrentCalls(e.target.value)}
                      className="w-20 h-10 px-3 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0 text-center text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="border-black text-black hover:bg-gray-100 hover:text-black rounded-md h-12 px-6 w-full font-medium text-xs"
                  >
                    SAVE DRAFT
                  </Button>
                  <Button
                    onClick={handleTestCampaign}
                    disabled={!selectedDate || !selectedTime || !csvFile}
                    className="bg-black text-[#b5d333] hover:bg-gray-900 rounded-md h-12 px-6 w-full font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    TEST CAMPAIGN
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {/* Test Call Modal */}
      <TestCallModal open={showTestCallModal} onOpenChange={setShowTestCallModal} onMakeCall={handleMakeTestCall} />
    </div>
  )
}
