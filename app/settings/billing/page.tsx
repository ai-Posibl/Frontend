"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold">Billing & Credits</h1>
        </div>

        {/* Current Balance Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold mb-4">Current Balance</h2>
              <div className="text-2xl font-bold mb-2">$ 100.00</div>
              <div className="text-xs text-gray-500">Available Credits: 3,500</div>
            </div>
            <Button
              onClick={handleAddCredits}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-xs"
            >
              ADD CREDITS
            </Button>
          </div>
        </div>

        {/* Purchase History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-base font-bold">Purchase History</h2>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-xs flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              DOWNLOAD
            </Button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 text-xs font-medium text-gray-600 border-b border-gray-100">
            <div>Month</div>
            <div>Year</div>
            <div>Mode of Payment</div>
            <div>Total Cost</div>
            <div>Credits</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {purchaseHistory.map((record, index) => (
              <div key={record.id} className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50">
                <div className="text-xs text-gray-700">{record.month}</div>
                <div className="text-xs text-gray-700">{record.year}</div>
                <div className="text-xs text-gray-700">{record.paymentMethod}</div>
                <div className="text-xs text-gray-700 font-medium">{record.totalCost}</div>
                <div className="text-xs text-gray-700 font-medium">{record.credits}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
