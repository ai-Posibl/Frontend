"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { motion } from "framer-motion"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = () => {
    setNewPassword("")
    setConfirmPassword("")
    setError(null)
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    // Reset error state
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsLoading(false)
      setNewPassword("")
      setConfirmPassword("")
      onOpenChange(false)

      // Show success message
      alert("Password changed successfully!")
    } catch (err) {
      setError("Failed to change password. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[400px]">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full flex flex-col"
        >
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl font-bold">Change Password</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setError(null) // Clear error when user types
                }}
                className={`h-12 px-4 rounded-md border focus:ring-0 ${
                  error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                }`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                Re-enter New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError(null) // Clear error when user types
                }}
                className={`h-12 px-4 rounded-md border focus:ring-0 ${
                  error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                }`}
              />
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </div>

          <SheetFooter className="pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex space-x-3 w-full"
            >
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                CANCEL
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading || !newPassword || !confirmPassword}
                className="flex-1 h-12 bg-black text-white hover:bg-gray-900 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "CONFIRM"
                )}
              </Button>
            </motion.div>
          </SheetFooter>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
