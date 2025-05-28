"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Check } from "lucide-react"
import { motion } from "framer-motion"
import { ChangePasswordModal } from "@/components/change-password-modal"

export default function AccountSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleChangePassword = () => {
    setShowChangePassword(true)
  }

  const handleManageBilling = () => {
    console.log("Manage billing clicked")
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
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </motion.div>

        {/* Profile Information & Contact Details */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <h2 className="text-lg font-bold mb-6">Profile Information</h2>
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold relative">
                  S
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-3 w-3 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Full Name:</span>
                    <span className="font-medium">Admin User</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Username:</span>
                    <span className="font-medium">admin_user</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Role:</span>
                    <span className="font-medium">Administrator</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Contact Details</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  EDIT
                </Button>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center"
              >
                <span className="text-gray-600 font-medium">Email:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">admin@posibl.ai</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between items-center"
              >
                <span className="text-gray-600 font-medium">Phone Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">+1 (555) 123-4567</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Security Settings</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleChangePassword}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  CHANGE PASSWORD
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Subscription & Credits */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription */}
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <h2 className="text-lg font-bold mb-6">Subscription & Credits</h2>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center"
              >
                <span className="text-gray-600 font-medium">Subscription</span>
                <span className="font-medium">Yearly</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl font-bold">Professional</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-[#b5d333] text-black hover:bg-[#b5d333] font-medium">ACTIVE</Badge>
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <span className="text-gray-500 text-sm">Renew Date: 10/1/2026</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Credits */}
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Credits</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleManageBilling}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  MANAGE BILLING
                </Button>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold">5000</span>
                  <span className="text-gray-600">Used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-[#b5d333] h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "50%" }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
                <span className="text-gray-500 text-sm">Out of 10000</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Change Password Modal */}
      <ChangePasswordModal open={showChangePassword} onOpenChange={setShowChangePassword} />
    </DashboardLayout>
  )
}
