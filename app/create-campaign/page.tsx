"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { CSVUploader } from "@/components/ui/csv-uploader"
import { CheckCircle, Play, ArrowLeft, Download } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { useAuth, withAuth } from "@/hooks/use-auth"
import { agentApi, campaignApi, contactListApi, contactApi, callApi, Agent } from "@/lib/api"
import { toast } from "sonner"

// Fallback agents in case API fails
const fallbackAgents = [
  {
    id: "fallback-riya",
    name: "Riya-Wishfin",
    description: "Riya is a conversational AI agent for Wishfin that chats in Indian English or Hinglish to offer pre-approved Tata Capital personal loans and assist with the application.",
    type: "loan_application" as const,
    voiceConfig: { language: "British" },
    languageSettings: {},
    organizationId: "",
    createdById: "",
    version: "1.0",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-john",
    name: "John-PhonePe",
    description: "John is a sales agent for Phone Pay. His task is to sell Phone Pay payment gateway to the user. He is a very friendly and engaging person and he is very good at selling.",
    type: "customer_service" as const,
    voiceConfig: { language: "British" },
    languageSettings: {},
    organizationId: "",
    createdById: "",
    version: "1.0",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-sarah",
    name: "Sarah-Banking",
    description: "Sarah specializes in banking services. She helps customers understand different account options, credit cards, and investment opportunities with a friendly and professional approach.",
    type: "customer_service" as const,
    voiceConfig: { language: "American" },
    languageSettings: {},
    organizationId: "",
    createdById: "",
    version: "1.0",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-raj",
    name: "Raj-Insurance",
    description: "Raj is an insurance specialist who explains policy details, coverage options, and helps customers find the right insurance plan for their needs with clear and simple explanations.",
    type: "customer_service" as const,
    voiceConfig: { language: "Indian" },
    languageSettings: {},
    organizationId: "",
    createdById: "",
    version: "1.0",
    createdAt: "",
    updatedAt: "",
  },
]

function CreateCampaignPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])

  // Step 1 state - Campaign Name and Agent Selection
  const [campaignName, setCampaignName] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")

  // Step 2 state - Campaign Configuration
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [concurrentCalls, setConcurrentCalls] = useState("1")

  // Fetch agents from backend
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching agents from backend...')
        
        const agentsData = await agentApi.getAll()
        console.log('Agents fetched successfully:', agentsData)
        console.log('Agent data type:', typeof agentsData)
        console.log('Is array:', Array.isArray(agentsData))
        console.log('Length:', agentsData?.length)
        
        if (Array.isArray(agentsData) && agentsData.length > 0) {
          setAgents(agentsData)
          // Set first agent as default selection
          setSelectedAgent(agentsData[0].id)
          console.log('Set agents from backend:', agentsData)
          toast.success(`Loaded ${agentsData.length} agent(s) from database`)
        } else {
          console.log('No agents found in database, using fallback agents')
          // Use fallback agents if no agents found
          setAgents(fallbackAgents)
          setSelectedAgent(fallbackAgents[0].id)
          toast.warning('No agents found in database, using default agents')
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error)
        // Use fallback agents on error
        setAgents(fallbackAgents)
        setSelectedAgent(fallbackAgents[0].id)
        toast.error(`Failed to load agents from database: ${error instanceof Error ? error.message : 'Unknown error'}. Using default agents.`)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      console.log('User is authenticated:', user.email)
      fetchAgents()
    } else {
      console.log('User is not authenticated')
    }
  }, [user])

  const getAgentLanguage = (agent: Agent) => {
    return agent.voiceConfig?.language || 'English'
  }

  const getAgentImage = (agent: Agent) => {
    // Generate different placeholder based on agent name/type
    const query = agent.name.toLowerCase().includes('riya') ? 'smiling woman with brown hair' :
                  agent.name.toLowerCase().includes('john') ? 'serious man with dark hair' :
                  agent.name.toLowerCase().includes('sarah') ? 'professional woman with blonde hair' :
                  agent.name.toLowerCase().includes('raj') ? 'indian man with glasses' :
                  'professional person'
    return `/placeholder.svg?height=80&width=80&query=${query}`
  }

  const handleClose = () => {
    router.push("/")
  }

  const handleRunCampaign = async () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name")
      return
    }

    if (!user) {
      toast.error("You must be logged in to run a campaign")
      return
    }

    // For step 2, require all fields
    if (currentStep === 2 && (!selectedDate || !selectedTime || !csvFile)) {
      toast.error("Please complete all required fields")
      return
    }

    setIsSaving(true)

    try {
      // Step 1: Create a default contact list for this campaign
      const contactListData = {
        name: `${campaignName} - Contact List`,
        description: `Contact list for campaign: ${campaignName}`,
      }

      const contactList = await contactListApi.create(contactListData)
      console.log('Contact list created:', contactList)

      // Step 2: Create the campaign with the contact list ID
      const campaignData = {
        name: campaignName,
        description: `Campaign created with ${csvFile ? 'CSV upload' : 'no contacts'}`,
        type: "outbound" as const,
        agentId: selectedAgent,
        contactListId: contactList.id,
        startDate: selectedDate?.toISOString(),
        endDate: undefined,
        dailyStartTime: selectedTime || undefined,
        dailyEndTime: undefined,
        maxAttempts: 3,
        concurrentCalls: parseInt(concurrentCalls) || 1,
      }

      const campaign = await campaignApi.create(campaignData)
      console.log('Campaign created:', campaign)

      // Step 3: If we're on step 2 and have a CSV file, process it
      if (currentStep === 2 && csvFile) {
        try {
          // Parse CSV file
          const contacts = await parseCSVFile(csvFile)
          console.log('Parsed contacts:', contacts)

          if (contacts.length === 0) {
            toast.error("No valid contacts found in CSV file")
            return
          }

          // Bulk import contacts
          const importResult = await contactApi.bulkImport(contactList.id, contacts)
          console.log('Contacts imported:', importResult)

          const successfulContacts = importResult.contacts || []
          
          if (successfulContacts.length === 0) {
            toast.error("No contacts were imported successfully")
            return
          }

          // Step 4: Create calls for each imported contact
          const callPromises = successfulContacts.map((contact: any) => 
            callApi.create({
              campaignId: campaign.id,
              agentId: selectedAgent,
              contactId: contact.id,
              type: 'outbound',
              scheduledAt: selectedDate,
              notes: `Campaign: ${campaignName}`,
            })
          )

          const calls = await Promise.allSettled(callPromises)
          const successfulCalls = calls.filter(result => result.status === 'fulfilled').length
          const failedCalls = calls.filter(result => result.status === 'rejected').length

          console.log(`Created ${successfulCalls} calls, ${failedCalls} failed`)

          toast.success(
            `Campaign launched successfully! Created ${successfulContacts.length} contacts and ${successfulCalls} calls.`
          )
        } catch (csvError) {
          console.error('Error processing CSV:', csvError)
          toast.error(`Failed to process CSV: ${csvError instanceof Error ? csvError.message : 'Unknown error'}`)
          return
        }
      } else {
        // Just created campaign without contacts
        toast.success("Campaign created successfully as draft!")
      }

      router.push("/")
    } catch (error) {
      console.error('Failed to run campaign:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to run campaign'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleContinue = () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name")
      return
    }
    setCurrentStep(2)
  }

  const handleBack = () => {
    setCurrentStep(1)
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

  // Function to parse CSV file
  const parseCSVFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split('\n').filter(line => line.trim())
          if (lines.length < 2) {
            reject(new Error('CSV file must have at least a header and one data row'))
            return
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
          const contacts = []

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim())
            if (values.length !== headers.length) continue

            const contact: any = {}
            headers.forEach((header, index) => {
              const value = values[index]
              if (header.includes('name')) {
                contact.firstName = value
              } else if (header.includes('phone')) {
                contact.phoneNumber = value
              } else if (header.includes('email')) {
                contact.email = value
              } else {
                if (!contact.customFields) contact.customFields = {}
                contact.customFields[header] = value
              }
            })

            if (contact.phoneNumber) {
              contacts.push(contact)
            }
          }

          resolve(contacts)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <motion.button
          onClick={currentStep === 1 ? () => router.back() : handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-black font-medium hover:text-gray-700 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          BACK
        </motion.button>
        <button onClick={handleClose} className="text-black font-medium hover:text-gray-700 text-sm">
          CLOSE
        </button>
      </div>

      <div className="flex-1 flex justify-center py-8">
        <div className="w-full max-w-2xl px-6">
          <h1 className="text-2xl font-bold mb-8 text-center">Create Campaign</h1>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${currentStep >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {currentStep > 1 ? <CheckCircle className="h-5 w-5 text-[#b5d333]" /> : "1"}
            </div>
            <div
              className={`h-[2px] w-32 mx-4 transition-all duration-300 ${currentStep > 1 ? "bg-black" : "bg-gray-300"}`}
            ></div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${currentStep === 2 ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
            >
              2
            </div>
          </div>

          {currentStep === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-6 text-gray-700 text-center">
                Start by naming your campaign and selecting your AI agent.
              </p>

              <div className="space-y-6">
                {/* Campaign Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <Input
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Enter campaign name"
                    className="w-full h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
                  />
                </div>

                {/* Agent Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Select AI Agent</label>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {agents.map((agent) => (
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
                              src={getAgentImage(agent)}
                              alt={agent.name}
                              width={60}
                              height={60}
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-bold">{agent.name}</h3>
                              <Checkbox
                                checked={selectedAgent === agent.id}
                                onCheckedChange={() => setSelectedAgent(agent.id)}
                                className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333]"
                              />
                            </div>
                            <p className="text-gray-700 text-sm mt-2 mb-3">{agent.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <button className="flex items-center bg-black text-white rounded-full p-2 mr-3">
                                  <Play className="h-3 w-3" />
                                </button>
                                <span className="text-sm text-gray-600">Voice Sample</span>
                              </div>
                              <div className="flex items-center">
                                <Image
                                  src={`/placeholder.svg?height=16&width=16&query=${getAgentLanguage(agent)} flag`}
                                  alt={getAgentLanguage(agent)}
                                  width={16}
                                  height={16}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-600">{getAgentLanguage(agent)}</span>
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
                    onClick={handleRunCampaign}
                    disabled={isSaving}
                    className="border-black text-black hover:bg-gray-100 hover:text-black rounded-md h-12 px-6 w-full font-medium"
                  >
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    RUN CAMPAIGN
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={!campaignName.trim()}
                    className="bg-black text-[#b5d333] hover:bg-gray-900 rounded-md h-12 px-6 w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    CONTINUE
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-6 text-gray-700 text-center">
                Configure your campaign settings and upload your contact list.
              </p>

              <div className="space-y-6">
                {/* Campaign Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Campaign Summary</h3>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Name:</strong> {campaignName}
                    </p>
                    <p>
                      <strong>Agent:</strong> {agents.find((agent) => agent.id === selectedAgent)?.name}
                    </p>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Schedule Campaign</label>
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker date={selectedDate} setDate={setSelectedDate} placeholder="Select Date" />
                    <TimePicker time={selectedTime} setTime={setSelectedTime} placeholder="Select Time" />
                  </div>
                </div>

                {/* CSV Upload */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">Upload Contact List</label>
                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="text-xs h-8 px-3">
                      <Download className="h-3 w-3 mr-1" />
                      Download Template
                    </Button>
                  </div>
                  <CSVUploader onFileChange={setCsvFile} />
                </div>

                {/* Concurrent Calls */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Campaign Settings</label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div>
                      <div className="font-medium text-gray-900">Total Concurrent Calls</div>
                      <div className="text-sm text-gray-600">Maximum: 5 calls</div>
                    </div>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={concurrentCalls}
                      onChange={(e) => setConcurrentCalls(e.target.value)}
                      className="w-20 h-10 px-3 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0 text-center"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleRunCampaign}
                    disabled={isSaving}
                    className="border-black text-black hover:bg-gray-100 hover:text-black rounded-md h-12 px-6 w-full font-medium"
                  >
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    RUN CAMPAIGN
                  </Button>
                  <Button
                    onClick={handleRunCampaign}
                    disabled={!selectedDate || !selectedTime || !csvFile || isSaving}
                    className="bg-black text-[#b5d333] hover:bg-gray-900 rounded-md h-12 px-6 w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    RUN CAMPAIGN
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(CreateCampaignPage)
