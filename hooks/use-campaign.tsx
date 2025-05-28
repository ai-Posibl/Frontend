"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { campaignApi, agentApi, Campaign, Agent } from '@/lib/api';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export interface CampaignFormData {
  name: string;
  description?: string;
  type: Campaign['type'];
  agentId: string;
  startDate?: Date;
  endDate?: Date;
  dailyStartTime?: string;
  dailyEndTime?: string;
  maxAttempts: number;
  concurrentCalls: number;
}

interface UseCampaignReturn {
  // State
  agents: Agent[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  
  // Actions
  createCampaign: (data: CampaignFormData) => Promise<Campaign | null>;
  createDraftCampaign: (data: CampaignFormData) => Promise<Campaign | null>;
  refreshAgents: () => Promise<void>;
}

export function useCampaign(): UseCampaignReturn {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const agentsData = await agentApi.getAll();
      setAgents(agentsData);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setError(error instanceof Error ? error.message : 'Failed to load agents');
      // Set some default agents if API fails
      setAgents([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const createCampaign = useCallback(async (data: CampaignFormData): Promise<Campaign | null> => {
    if (!user) {
      toast.error('You must be logged in to create a campaign');
      return null;
    }

    setIsCreating(true);
    try {
      const campaignData = {
        name: data.name,
        description: data.description,
        type: data.type,
        agentId: data.agentId,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
        dailyStartTime: data.dailyStartTime,
        dailyEndTime: data.dailyEndTime,
        maxAttempts: data.maxAttempts,
        concurrentCalls: data.concurrentCalls,
        organizationId: user.organizationId,
        createdById: user.id,
        status: 'active' as const,
      };

      const campaign = await campaignApi.create(campaignData);
      toast.success('Campaign created successfully!');
      
      // Navigate back to dashboard
      router.push('/');
      
      return campaign;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create campaign';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [user, router]);

  const createDraftCampaign = useCallback(async (data: CampaignFormData): Promise<Campaign | null> => {
    if (!user) {
      toast.error('You must be logged in to save a draft');
      return null;
    }

    setIsCreating(true);
    try {
      const campaignData = {
        name: data.name,
        description: data.description,
        type: data.type,
        agentId: data.agentId,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
        dailyStartTime: data.dailyStartTime,
        dailyEndTime: data.dailyEndTime,
        maxAttempts: data.maxAttempts,
        concurrentCalls: data.concurrentCalls,
        organizationId: user.organizationId,
        createdById: user.id,
        status: 'draft' as const,
      };

      const campaign = await campaignApi.create(campaignData);
      toast.success('Draft saved successfully!');
      
      // Navigate back to dashboard
      router.push('/');
      
      return campaign;
    } catch (error) {
      console.error('Failed to save draft:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [user, router]);

  return {
    agents,
    isLoading,
    isCreating,
    error,
    createCampaign,
    createDraftCampaign,
    refreshAgents: fetchAgents,
  };
} 