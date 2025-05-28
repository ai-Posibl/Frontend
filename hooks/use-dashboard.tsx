"use client"

import { useState, useEffect, useCallback } from 'react';
import { campaignApi, analyticsApi, Campaign, DashboardAnalytics } from '@/lib/api';
import { useAuth } from './use-auth';

interface DashboardData {
  campaigns: Campaign[];
  analytics: DashboardAnalytics | null;
  isLoading: boolean;
  error: string | null;
}

interface UseDashboardReturn extends DashboardData {
  refreshData: () => Promise<void>;
  hasCampaigns: boolean;
  activeCampaigns: Campaign[];
  recentCampaigns: Campaign[];
}

export function useDashboard(): UseDashboardReturn {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData>({
    campaigns: [],
    analytics: null,
    isLoading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Calculate date range (last 6 months)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      // Fetch campaigns and analytics concurrently
      const [campaignsResponse, analyticsResponse] = await Promise.allSettled([
        campaignApi.getAll(),
        analyticsApi.getDashboardSummary(
          startDate.toISOString(),
          endDate.toISOString()
        ).catch(() => null), // Don't fail if analytics endpoint doesn't work
      ]);

      const campaigns = campaignsResponse.status === 'fulfilled' ? campaignsResponse.value : [];
      const analytics = analyticsResponse.status === 'fulfilled' ? analyticsResponse.value : null;

      setData({
        campaigns,
        analytics,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data',
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived data
  const hasCampaigns = data.campaigns.length > 0;
  const activeCampaigns = data.campaigns.filter(campaign => campaign.status === 'active');
  const recentCampaigns = data.campaigns
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    ...data,
    refreshData: fetchDashboardData,
    hasCampaigns,
    activeCampaigns,
    recentCampaigns,
  };
}

// Helper hook for campaign statistics
export function useCampaignStats(campaigns: Campaign[]) {
  return {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    byType: campaigns.reduce((acc, campaign) => {
      acc[campaign.type] = (acc[campaign.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
} 