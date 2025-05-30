"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Check } from "lucide-react"
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        {/* Profile Information & Contact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
            <h2 className="text-base font-bold mb-6">Profile Information</h2>
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold relative">
                  S
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-xs">Full Name:</span>
                  <span className="font-medium text-xs">Admin User</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-xs">Username:</span>
                  <span className="font-medium text-xs">admin_user</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-xs">Role:</span>
                  <span className="font-medium text-xs">Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold">Contact Details</h2>
              <Button onClick={handleEdit} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                EDIT
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium text-xs">Email:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-xs">admin@posibl.ai</span>
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium text-xs">Phone Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-xs">+1 (555) 123-4567</span>
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Security Settings</h2>
              <Button
                onClick={handleChangePassword}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                CHANGE PASSWORD
              </Button>
            </div>
          </div>
        </div>

        {/* Subscription & Credits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
            <h2 className="text-lg font-bold mb-6">Subscription & Credits</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Subscription</span>
                <span className="font-medium">Yearly</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold">Professional</span>
                <Badge className="bg-[#b5d333] text-black hover:bg-[#b5d333] font-medium">ACTIVE</Badge>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Renew Date: 10/1/2026</span>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Credits</h2>
              <Button
                onClick={handleManageBilling}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                MANAGE BILLING
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold">5000</span>
                  <span className="text-gray-600">Used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-[#b5d333] h-2 rounded-full" style={{ width: "50%" }} />
                </div>
                <span className="text-gray-500 text-sm">Out of 10000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal open={showChangePassword} onOpenChange={setShowChangePassword} />
    </DashboardLayout>
  )
}
