"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TestCallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMakeCall: (data: TestCallData) => void
}

interface TestCallData {
  phoneNumber: string
  name: string
  age: string
  dateOfBirth: string
  additionalData: string
}

export function TestCallModal({ open, onOpenChange, onMakeCall }: TestCallModalProps) {
  const [formData, setFormData] = useState<TestCallData>({
    phoneNumber: "",
    name: "",
    age: "",
    dateOfBirth: "",
    additionalData: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setFormData({
      phoneNumber: "",
      name: "",
      age: "",
      dateOfBirth: "",
      additionalData: "",
    })
    onOpenChange(false)
  }

  const handleMakeCall = async () => {
    // Basic validation
    if (!formData.phoneNumber || !formData.name) {
      alert("Please fill in required fields (Phone Number and Name)")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onMakeCall(formData)
    setIsLoading(false)
    handleClose()
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold">Input Data</h2>
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <Label htmlFor="additionalData" className="text-sm font-medium text-gray-700">
                Additional Data (JSON format)
              </Label>
              <Textarea
                id="additionalData"
                placeholder='{"key": "value", "customField": "data"}'
                value={formData.additionalData}
                onChange={(e) => setFormData({ ...formData, additionalData: e.target.value })}
                className="min-h-[100px] px-4 py-3 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0 font-mono text-sm"
              />
            </motion.div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Button
                onClick={handleMakeCall}
                disabled={isLoading || !formData.phoneNumber || !formData.name}
                className="w-full h-12 bg-black text-[#b5d333] hover:bg-gray-900 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-[#b5d333] border-t-transparent rounded-full"
                    />
                    <span>MAKING CALL...</span>
                  </div>
                ) : (
                  "MAKE CALL"
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
