"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, ChevronDown, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AddTeamMemberModal } from "@/components/add-team-member-modal"

interface TeamMember {
  id: string
  name: string
  lastName: string
  email: string
  role: string
  department: string
  employeeId: string
  status: "ACTIVE" | "PENDING"
  selected: boolean
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddMember, setShowAddMember] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "You",
      lastName: "",
      email: "suman@posibl.ai",
      role: "Owner",
      department: "N/A",
      employeeId: "EMP001",
      status: "ACTIVE",
      selected: false,
    },
    {
      id: "2",
      name: "Kiran",
      lastName: "",
      email: "kiran@posibl.ai",
      role: "Employee",
      department: "Marketing",
      employeeId: "EMP002",
      status: "PENDING",
      selected: false,
    },
  ])

  const handleAddTeamMember = () => {
    setShowAddMember(true)
  }

  const handleAddMember = (newMember: Omit<TeamMember, "selected">) => {
    setTeamMembers([...teamMembers, { ...newMember, selected: false }])
  }

  const handleCheckboxChange = (memberId: string, checked: boolean) => {
    setTeamMembers(teamMembers.map((member) => (member.id === memberId ? { ...member, selected: checked } : member)))
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
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Team</h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddTeamMember}
              className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium transition-all duration-200"
            >
              + ADD TEAM
            </Button>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white rounded-full border-gray-200 focus:ring-2 focus:ring-[#b5d333] focus:ring-opacity-20 transition-all duration-200"
          />
        </motion.div>

        {/* Table */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-600 border-b border-gray-100">
            <div className="col-span-1 flex items-center">
              <Checkbox className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333]" />
            </div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2 flex items-center">
              Role
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
            <div className="col-span-2">Employee ID</div>
            <div className="col-span-2">Department</div>
            <div className="col-span-1 flex items-center">
              All
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors duration-200"
                >
                  <div className="col-span-1">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Checkbox
                        checked={member.selected}
                        onCheckedChange={(checked) => handleCheckboxChange(member.id, checked as boolean)}
                        className="data-[state=checked]:bg-[#b5d333] data-[state=checked]:text-black data-[state=checked]:border-[#b5d333] transition-all duration-200"
                      />
                    </motion.div>
                  </div>
                  <div className="col-span-3">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div className="font-medium text-gray-900">
                        {member.name} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </motion.div>
                  </div>
                  <div className="col-span-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <Badge
                        className={
                          member.role === "Owner"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {member.role}
                      </Badge>
                    </motion.div>
                  </div>
                  <div className="col-span-2">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="text-gray-600"
                    >
                      {member.employeeId}
                    </motion.span>
                  </div>
                  <div className="col-span-2">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="text-gray-600"
                    >
                      {member.department}
                    </motion.span>
                  </div>
                  <div className="col-span-1">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        className={
                          member.status === "ACTIVE"
                            ? "bg-[#b5d333] text-black hover:bg-[#b5d333]"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {member.status}
                      </Badge>
                    </motion.div>
                  </div>
                  <div className="col-span-1">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button variant="ghost" size="sm" className="hover:bg-gray-200 transition-all duration-200">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Team Member Modal */}
      <AddTeamMemberModal open={showAddMember} onOpenChange={setShowAddMember} onAddMember={handleAddMember} />
    </DashboardLayout>
  )
}
