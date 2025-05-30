"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Settings, ChevronRight, LogOut, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationDropdown } from "@/components/notification-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Custom icon components with smaller sizing
const DashboardIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
    {filled ? (
      <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
    ) : (
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
    )}
    <rect x="7" y="7" width="10" height="10" rx="2" fill={filled ? "white" : "currentColor"} />
  </svg>
)

const CampaignIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M18 8V6C18 4.89543 17.1046 4 16 4H6L2 8L6 12H16C17.1046 12 18 11.1046 18 10V8ZM18 8L22 5V11L18 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const AgentsIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="6" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" />
  </svg>
)

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [settingsExpanded, setSettingsExpanded] = useState(false)
  const [wasCollapsed, setWasCollapsed] = useState<boolean | null>(null)
  
  // Initialize collapsed state from localStorage or default to false
  const [collapsed, setCollapsed] = useState(false)
  
  // Load collapsed state from localStorage on component mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebarCollapsed")
    if (savedCollapsed !== null) {
      setCollapsed(JSON.parse(savedCollapsed))
    }
  }, [])

  // Handle collapse toggle with localStorage persistence
  const handleCollapseToggle = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newCollapsed))
  }

  // Handle settings click
  const handleSettingsClick = () => {
    if (collapsed) {
      // Store the fact that it was collapsed
      setWasCollapsed(true)
      // Uncollapse the sidebar
      setCollapsed(false)
    }
    setSettingsExpanded(!settingsExpanded)
  }

  // Handle settings item click
  const handleSettingsItemClick = () => {
    // If it was collapsed before opening settings, collapse it back
    if (wasCollapsed) {
      setCollapsed(true)
      setWasCollapsed(null)
    }
    setSettingsExpanded(false)
  }

  const navItems = [
    { icon: DashboardIcon, label: "Dashboard", href: "/" },
    { icon: CampaignIcon, label: "Campaign", href: "/campaigns" },
    { icon: AgentsIcon, label: "Agents", href: "/agents" },
  ]

  const settingsItems = [
    { label: "Account Settings", href: "/settings/account" },
    // Temporarily hidden for production - Add Team option
    // { label: "Add Team", href: "/settings/team" },
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

  const handleContactUs = () => {
    window.location.href = "mailto:support@posibl.ai?subject=Support Request"
  }

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("campaignDraft")
    localStorage.removeItem("campaignData")
    router.push("/login")
  }

  const isSettingsPage = pathname.startsWith("/settings")

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex">
      {/* Sidebar - Fixed positioning */}
      <div
        style={{ width: collapsed ? 50 : 180 }}
        className="bg-white flex flex-col fixed left-0 top-0 bottom-0 h-screen shadow-lg z-20"
      >
        {/* Logo Section - Reduced padding */}
        <div className="flex items-center justify-center py-3 px-2 border-b border-gray-100 flex-shrink-0">
          <Link href="/" className="cursor-pointer">
            {!collapsed ? (
              <Image src="/logo.png" alt="Posibl.ai" width={100} height={28} className="h-6 w-auto" />
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                <Image src="/logo-icon.png" alt="Posibl.ai" width={24} height={24} className="h-6 w-6" />
              </div>
            )}
          </Link>
        </div>

        {/* Main Navigation - Reduced spacing */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center px-2.5 py-2 rounded-lg ${
                        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`flex-shrink-0 ${isActive ? "text-white" : "text-gray-700"}`}
                        filled={isActive && item.label === "Dashboard"}
                      />
                      {!collapsed && <span className="ml-2.5 font-medium whitespace-nowrap text-xs">{item.label}</span>}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Navigation - Reduced spacing */}
        <div className="px-2 pb-3 border-t border-gray-100 pt-3 flex-shrink-0">
          {/* Settings with submenu */}
          <div className="mb-1">
            <button
              onClick={handleSettingsClick}
              className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg ${
                isSettingsPage ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <Settings className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="ml-2.5 font-medium whitespace-nowrap text-xs">Settings</span>}
              </div>
              {!collapsed && (
                <div style={{ transform: settingsExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                  <ChevronRight className="h-3 w-3 flex-shrink-0" />
                </div>
              )}
            </button>

            {/* Settings Submenu */}
            {settingsExpanded && !collapsed && (
              <div className="overflow-hidden">
                <ul className="ml-5 mt-1 space-y-0.5">
                  {settingsItems.map((item, index) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={handleSettingsItemClick}>
                        <div
                          className={`px-2.5 py-1.5 rounded-lg text-xs ${
                            pathname === item.href
                              ? "bg-gray-100 text-black font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }`}
                        >
                          {item.label}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact Us Button - Temporarily hidden for production */}
          {/* <button
            onClick={handleContactUs}
            className="flex items-center px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full mb-1"
          >
            <Mail className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="ml-2.5 font-medium whitespace-nowrap text-sm">Contact Us</span>}
          </button> */}

          <button
            onClick={handleCollapseToggle}
            className="flex items-center px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
          >
            <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0">
              <div style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)" }}>
                <ChevronRight className="h-2.5 w-2.5" />
              </div>
            </div>
            {!collapsed && <span className="ml-2.5 font-medium whitespace-nowrap text-xs">Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main content area - Adjusted margin for fixed sidebar */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: collapsed ? "50px" : "180px" }}>
        {/* Header - Reduced height */}
        <header className="bg-white border-b h-12 flex items-center px-4 sticky top-0 z-10 shadow-sm">
          <div className="font-medium text-xs">{getPageTitle()}</div>
          <div className="ml-auto flex items-center space-x-2">
            <Link href="/settings/billing">
              <Button
                variant="outline"
                className="bg-[#b5d333] text-black border-[#b5d333] hover:bg-[#a2c129] hover:text-black font-medium px-3 h-7 text-xs"
              >
                CREDITS
              </Button>
            </Link>
            <NotificationDropdown />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-6 w-6 bg-blue-500 cursor-pointer">
                  <AvatarFallback className="text-white text-xs">S</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => router.push("/settings/account")} className="cursor-pointer text-xs">
                  <User className="mr-2 h-3.5 w-3.5" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 text-xs">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
