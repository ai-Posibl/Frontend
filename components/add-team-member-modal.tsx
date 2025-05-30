"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { motion } from "framer-motion"

interface AddTeamMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: TeamMember) => void
}

interface TeamMember {
  id: string
  name: string
  lastName: string
  email: string
  role: string
  department: string
  employeeId: string
  status: "ACTIVE" | "PENDING"
}

export function AddTeamMemberModal({ open, onOpenChange, onAddMember }: AddTeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    department: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const departments = ["Marketing", "Sales", "Engineering", "Design", "Operations", "Finance", "HR"]

  const roles = ["Owner", "Admin", "Manager", "Employee", "Viewer"]

  const handleCancel = () => {
    setFormData({
      name: "",
      lastName: "",
      email: "",
      department: "",
      role: "",
    })
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    // Basic validation
    if (!formData.name || !formData.lastName || !formData.email || !formData.department || !formData.role) {
      alert("Please fill in all fields")
      return
    }

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate employee ID
    const employeeId = `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      employeeId,
      status: "PENDING",
    }

    onAddMember(newMember)

    setIsLoading(false)
    setFormData({
      name: "",
      lastName: "",
      email: "",
      department: "",
      role: "",
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[500px]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full flex flex-col"
        >
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl font-bold">Add Team Member</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-6">
            {/* Name and Last Name Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
                />
              </div>
            </motion.div>

            {/* Email and Department Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Role Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-2"
            >
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <SheetFooter className="pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex space-x-3 w-full"
            >
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.department ||
                  !formData.role
                }
                className="flex-1 h-12 bg-black text-[#b5d333] hover:bg-gray-900 font-medium"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 border-2 border-[#b5d333] border-t-transparent rounded-full"
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
