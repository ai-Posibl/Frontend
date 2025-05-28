"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { motion } from "framer-motion"

interface PurchaseRecord {
  id: string
  month: string
  year: string
  paymentMethod: string
  totalCost: string
  credits: string
}

export default function BillingInfoPage() {
  const purchaseHistory: PurchaseRecord[] = [
    {
      id: "1",
      month: "May",
      year: "2025",
      paymentMethod: "Visa ****1234",
      totalCost: "$100.00",
      credits: "3,500",
    },
    {
      id: "2",
      month: "May",
      year: "2025",
      paymentMethod: "Visa ****1234",
      totalCost: "$100.00",
      credits: "3,500",
    },
    {
      id: "3",
      month: "May",
      year: "2025",
      paymentMethod: "Visa ****1234",
      totalCost: "$100.00",
      credits: "3,500",
    },
    {
      id: "4",
      month: "May",
      year: "2025",
      paymentMethod: "Visa ****1234",
      totalCost: "$100.00",
      credits: "3,500",
    },
    {
      id: "5",
      month: "May",
      year: "2025",
      paymentMethod: "Visa ****1234",
      totalCost: "$100.00",
      credits: "3,500",
    },
  ]

  const handleAddCredits = () => {
    console.log("Add credits clicked")
  }

  const handleDownload = () => {
    console.log("Download purchase history")
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
          <h1 className="text-2xl font-bold">Billing & Credits</h1>
        </motion.div>

        {/* Current Balance Section */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-lg font-bold mb-4">Current Balance</h2>
                <div className="text-4xl font-bold mb-2">$ 100.00</div>
                <div className="text-gray-500">Available Credits: 3,500</div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleAddCredits}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                ADD CREDITS
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Purchase History Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Section Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-bold"
            >
              Purchase History
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                DOWNLOAD
              </Button>
            </motion.div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-600 border-b border-gray-100">
            <div>Month</div>
            <div>Year</div>
            <div>Mode of Payment</div>
            <div>Total Cost</div>
            <div>Credits</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {purchaseHistory.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.6 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ backgroundColor: "#f9fafb" }}
                className="grid grid-cols-5 gap-4 px-6 py-4 items-center transition-colors duration-200"
              >
                <div className="text-gray-700">{record.month}</div>
                <div className="text-gray-700">{record.year}</div>
                <div className="text-gray-700">{record.paymentMethod}</div>
                <div className="text-gray-700 font-medium">{record.totalCost}</div>
                <div className="text-gray-700 font-medium">{record.credits}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
