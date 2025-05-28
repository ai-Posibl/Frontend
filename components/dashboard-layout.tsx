"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Settings, ChevronRight, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Custom icon components
const DashboardIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    {filled ? (
      <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
    ) : (
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
    )}
    <rect x="7" y="7" width="10" height="10" rx="2" fill={filled ? "white" : "currentColor"} />
  </svg>
)

const CampaignIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M18 8V6C18 4.89543 17.1046 4 16 4H6L2 8L6 12H16C17.1046 12 18 11.1046 18 10V8ZM18 8L22 5V11L18 8Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)

const AgentsIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="6" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" />
  </svg>
)

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [settingsExpanded, setSettingsExpanded] = useState(false)

  const navItems = [
    { icon: DashboardIcon, label: "Dashboard", href: "/" },
    { icon: CampaignIcon, label: "Campaign", href: "/campaigns" },
    { icon: AgentsIcon, label: "Agents", href: "/agents" },
  ]

  const settingsItems = [
    { label: "Account Settings", href: "/settings/account" },
    { label: "Add Team", href: "/settings/team" },
    { label: "Billing Info", href: "/settings/billing" },
  ]

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard"
      case "/campaigns":
        return "Campaigns"
      case "/agents":
        return "Agents"
      case "/settings/account":
        return "Settings"
      case "/settings/team":
        return "Settings"
      case "/settings/billing":
        return "Settings"
      default:
        if (pathname.includes("/campaigns/") && pathname.includes("/info")) {
          return "Campaign Info"
        }
        return "Dashboard"
    }
  }

  const getUserInitials = () => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  const getUserDisplayName = () => {
    if (user) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`
      }
      return user.email
    }
    return "User"
  }

  const handleLogout = () => {
    logout()
  }

  const isSettingsPage = pathname.startsWith("/settings")

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex">
      {/* Sidebar - Made sticky */}
      <motion.div
        animate={{ width: collapsed ? 64 : 224 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white flex flex-col sticky top-0 h-screen shadow-sm"
      >
        {/* Logo */}
        <div className="p-4 pb-8">
          <div className="flex items-center justify-center">
            <Link href="/">
              <AnimatePresence mode="wait">
                {!collapsed ? (
                  <motion.div
                    key="full-logo"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image src="/logo.png" alt="Posibl.ai" width={120} height={32} className="h-8 w-auto" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon-logo"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <Image src="/logo-icon.png" alt="Posibl.ai" width={32} height={32} className="h-8 w-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon
                        className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-700"}`}
                        filled={isActive && item.label === "Dashboard"}
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 pb-4 space-y-2">
          {/* Settings with submenu */}
          <div>
            <motion.button
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isSettingsPage ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 font-medium whitespace-nowrap"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, rotate: settingsExpanded ? 90 : 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Settings Submenu */}
            <AnimatePresence>
              {settingsExpanded && !collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <motion.ul
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="ml-6 mt-2 space-y-1"
                  >
                    {settingsItems.map((item, index) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <Link href={item.href}>
                          <motion.div
                            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              pathname === item.href
                                ? "bg-gray-100 text-black font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {item.label}
                          </motion.div>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/help">
            <motion.div
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                pathname === "/help" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center">
                <span className="text-xs font-bold">?</span>
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 font-medium whitespace-nowrap"
                  >
                    Help
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center">
              <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="h-3 w-3" />
              </motion.div>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 font-medium whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-b h-16 flex items-center px-6 sticky top-0 z-10 shadow-sm"
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="font-medium text-lg"
          >
            {getPageTitle()}
          </motion.div>
          <div className="ml-auto flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="bg-[#b5d333] text-black border-[#b5d333] hover:bg-[#a2c129] hover:text-black font-medium px-6 transition-all duration-200"
                onClick={() => router.push('/settings/billing')}
              >
                CREDITS
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                />
              </Button>
            </motion.div>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8 bg-blue-500">
                      <AvatarFallback className="text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{getUserDisplayName()}</p>
                    {user && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/account" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}