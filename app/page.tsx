"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import DashboardLayout from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, BarChart3, Users, Clock, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth, withAuth } from "@/hooks/use-auth"
import { useDashboard, useCampaignStats } from "@/hooks/use-dashboard"

function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { campaigns, analytics, isLoading, error, hasCampaigns, activeCampaigns, refreshData } = useDashboard()
  const campaignStats = useCampaignStats(campaigns)

  const handleCreateCampaign = () => {
    router.push("/create-campaign")
  }

  const getUserDisplayName = () => {
    if (user) {
      return user.firstName || user.email.split('@')[0] || 'User'
    }
    return 'User'
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#b5d333] border-t-transparent rounded-full"
          />
        </motion.div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Error Loading Dashboard</CardTitle>
              <CardDescription className="text-red-600">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={refreshData} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {hasCampaigns ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <AnalyticsDashboard 
              campaigns={campaigns} 
              analytics={analytics} 
              user={user}
            />
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="p-6"
          >
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
            >
              <div className="relative h-56 bg-black rounded-t-lg overflow-hidden">
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Image
                    src="/hero-banner.png"
                    alt="Banner Background"
                    width={1200}
                    height={224}
                    className="w-full h-full object-cover"
                    priority
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-3xl font-medium text-white"
                  >
                    Hello {getUserDisplayName()} 👋
                  </motion.h1>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="p-8 text-center"
              >
                <p className="text-lg mb-2">Welcome to Posibl AI — where intelligent voice agents power your growth.</p>
                <p className="text-gray-600 mb-8">
                  Start a campaign, track performance, and optimize every conversation.
                </p>

                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    <Button
                      onClick={handleCreateCampaign}
                      className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium transition-all duration-200"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" /> CREATE CAMPAIGN
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Stats Section */}
         
            {/* Getting Started Section */}
         
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}

// Export the component wrapped with authentication
export default withAuth(DashboardPage)
