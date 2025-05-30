"use client"

import { useState, useEffect } from "react"
import { Bell, X, Megaphone, Phone, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: string
  type: 'campaign' | 'call' | 'prospect'
  message: string
  timestamp: number
  read: boolean
}

const getDemoNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      type: 'campaign',
      message: 'Campaign "Enterprise Sales Q2" completed with 85% success rate',
      timestamp: Date.now() - 900000, // 15 minutes ago
      read: false,
    },
    {
      id: '2',
      type: 'call',
      message: 'Scheduled call with John Smith from Acme Corp',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      read: false,
    },
    {
      id: '3',
      type: 'prospect',
      message: 'New high-value prospect: Sarah Johnson from Tech Solutions Inc',
      timestamp: Date.now() - 3600000, // 1 hour ago
      read: false,
    },
    {
      id: '4',
      type: 'campaign',
      message: 'New campaign "Tech Startups Outreach" is ready to launch',
      timestamp: Date.now() - 7200000, // 2 hours ago
      read: false,
    },
    {
      id: '5',
      type: 'call',
      message: 'Missed call from David Brown - Healthcare Division',
      timestamp: Date.now() - 18000000, // 5 hours ago
      read: false,
    }
  ]
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      if (parsed.length === 0) {
        // If notifications are empty, reset to demo notifications
        const demoNotifications = getDemoNotifications()
        setNotifications(demoNotifications)
        localStorage.setItem('notifications', JSON.stringify(demoNotifications))
      } else {
        setNotifications(parsed)
      }
    } else {
      // Initial demo notifications
      const demoNotifications = getDemoNotifications()
      setNotifications(demoNotifications)
      localStorage.setItem('notifications', JSON.stringify(demoNotifications))
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'campaign':
        return <Megaphone className="h-4 w-4 text-blue-500" />
      case 'call':
        return <Phone className="h-4 w-4 text-red-500" />
      case 'prospect':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - timestamp

    // Format time as HH:MM AM/PM
    const timeString = date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    })

    if (diff < 60000) return `Just now`
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago • ${timeString}`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago • ${timeString}`
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-7 w-7">
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
          <span className="font-medium text-xs">Notifications</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="text-[11px] text-gray-500 hover:text-gray-700 h-6 px-2"
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {notifications.length > 0 ? (
              [...notifications]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative px-4 py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-snug">{notification.message}</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 -mt-0.5"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-5 text-center text-xs text-gray-500">
                No new notifications
              </div>
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 