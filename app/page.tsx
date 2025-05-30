"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const router = useRouter()
  const [hasDraftData, setHasDraftData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDraftData = () => {
      try {
        const draftData = localStorage.getItem("campaignDraft")
        const campaignData = localStorage.getItem("campaignData")
        setHasDraftData(!!(draftData || campaignData))
      } catch (error) {
        console.error("Error checking localStorage:", error)
        setHasDraftData(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkDraftData()
  }, [])

  const handleCreateCampaign = () => {
    router.push("/create-campaign")
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-48">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-6 h-6 border-2 border-[#b5d333] border-t-transparent rounded-full"
          />
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {hasDraftData ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <AnalyticsDashboard />
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative h-44 bg-black rounded-t-lg overflow-hidden">
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src="/hero-banner.png"
                    alt="Banner Background"
                    width={1200}
                    height={176}
                    className="w-full h-full object-cover"
                    priority
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-2xl font-medium text-white"
                  >
                    Hello Suman
                  </motion.h1>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="p-6 text-center"
              >
                <p className="text-base mb-2">
                  Welcome to Posibl AI — where intelligent voice agents power your growth.
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                  Start a campaign, track performance, and optimize every conversation.
                </p>

                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Button
                      onClick={handleCreateCampaign}
                      className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium transition-all duration-200 h-9 px-4 text-sm"
                    >
                      <PlusIcon className="mr-2 h-3 w-3" /> CREATE CAMPAIGN
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
