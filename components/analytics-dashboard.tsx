"use client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"
import { MessageSquare, Phone, Clock, CheckCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Campaign, DashboardAnalytics, User } from "@/lib/api"
import { useCampaignStats } from "@/hooks/use-dashboard"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
  analytics: DashboardAnalytics | null;
  user: User | null;
}

export function AnalyticsDashboard({ campaigns, analytics, user }: AnalyticsDashboardProps) {
  const router = useRouter();
  const campaignStats = useCampaignStats(campaigns);

  const getUserDisplayName = () => {
    if (user) {
      return user.firstName || user.email.split('@')[0] || 'User'
    }
    return 'User'
  }

  // Generate chart data based on real campaigns
  const generateCampaignPerformanceData = () => {
    // Mock data for now since we don't have historical data
    // In a real app, this would come from analytics API
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const successfulLeads = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 10);
    const dialedCalls = Array.from({ length: 8 }, () => Math.floor(Math.random() * 60) + 20);
    const answered = Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 15);

    return {
      labels: months,
      datasets: [
        {
          label: "Successful Lead",
          data: successfulLeads,
          backgroundColor: "#b5d333",
          borderColor: "#b5d333",
          borderWidth: 1,
        },
        {
          label: "Dialed Calls",
          data: dialedCalls,
          backgroundColor: "#333333",
          borderColor: "#333333",
          borderWidth: 1,
        },
        {
          label: "Answered",
          data: answered,
          backgroundColor: "#888888",
          borderColor: "#888888",
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate call insights data
  const generateCallInsightsData = () => {
    return {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Total Calls",
          data: [analytics?.totalCalls || 300, 400, 350, 380],
          borderColor: "#333333",
          backgroundColor: "rgba(51, 51, 51, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Connected Call",
          data: [analytics?.completedCalls || 250, 350, 300, 320],
          borderColor: "#b5d333",
          backgroundColor: "rgba(181, 211, 51, 0.3)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const campaignPerformanceData = generateCampaignPerformanceData();
  const callInsightsData = generateCallInsightsData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f0f0f0",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Generate recent campaigns for scoreboard
  const getRecentCampaigns = () => {
    return campaigns.slice(0, 3).map((campaign, index) => ({
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      outbound: Math.floor(Math.random() * 1000) + 500, // Mock data
      connected: Math.floor(Math.random() * 800) + 300,
      engagement: `${Math.floor(Math.random() * 40) + 40}%`,
      color: index === 0 ? "text-[#b5d333]" : index === 1 ? "text-orange-500" : "text-red-500",
    }));
  };

  const recentCampaigns = getRecentCampaigns();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Hello {getUserDisplayName()} 👋</h1>
          <div className="flex items-center text-gray-600">
            <span>Last 6 Months</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
        </div>
        <Button 
          className="bg-black text-[#b5d333] hover:bg-gray-900 font-medium" 
          onClick={() => router.push('/create-campaign')}
        >
          + CREATE CAMPAIGN
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Campaigns */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-600 font-medium">Total Campaigns</span>
          </div>
          <div className="text-3xl font-bold mb-4">{campaignStats.total}</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#b5d333] rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <span className="font-semibold">{campaignStats.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Paused</span>
              </div>
              <span className="font-semibold">{campaignStats.paused}</span>
            </div>
          </div>
        </div>

        {/* Calls Analytics */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Phone className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-600 font-medium">Total Calls</span>
          </div>
          <div className="text-3xl font-bold mb-4">{analytics?.totalCalls || 0}</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#b5d333] rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="font-semibold">{analytics?.completedCalls || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Failed</span>
              </div>
              <span className="font-semibold">{analytics?.failedCalls || 0}</span>
            </div>
          </div>
        </div>

        {/* Call Duration */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-600 font-medium">Call Duration</span>
          </div>
          <div className="text-3xl font-bold mb-4">
            {analytics?.totalDuration ? Math.floor(analytics.totalDuration / 60) : 0}{" "}
            <span className="text-lg text-gray-600">mins</span>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Avg. Call Duration</div>
            <div className="text-lg font-semibold">
              {analytics?.averageDuration ? Math.floor(analytics.averageDuration) : 0} Secs
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-600 font-medium">Success Rate</span>
          </div>
          <div className="text-3xl font-bold mb-4">
            {analytics?.completionRate ? Math.floor(analytics.completionRate) : 0}%
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Completion Rate</div>
            <div className="text-lg font-semibold">
              {analytics?.totalCalls ? `${analytics.completedCalls}/${analytics.totalCalls}` : '0/0'}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Campaign Performance */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Campaign Performance Trends</h3>
            <div className="flex items-center text-gray-600">
              <span>Last 8 Months</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </div>
          <div className="h-80">
            <Bar data={campaignPerformanceData} options={chartOptions} />
          </div>
        </div>

        {/* Call Insights */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Call Insights</h3>
            <div className="flex items-center text-gray-600">
              <span>This Month</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </div>
          <div className="h-80">
            <Line data={callInsightsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Campaign Scoreboard */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Campaign Scoreboard</h3>
        {recentCampaigns.length > 0 ? (
          <div className="space-y-4">
            {recentCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'paused' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex space-x-8 mt-1">
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="font-semibold capitalize">{campaign.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Outbound Calls</div>
                      <div className="font-semibold">{campaign.outbound.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Connected</div>
                      <div className="font-semibold">{campaign.connected}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Engagement Rate</div>
                      <div className={`font-semibold ${campaign.color}`}>{campaign.engagement}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No campaigns found. Create your first campaign to see performance data.</p>
            <Button 
              className="mt-4 bg-black text-[#b5d333] hover:bg-gray-900" 
              onClick={() => router.push('/create-campaign')}
            >
              Create Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
