const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  token?: string;
  refreshToken?: string;
  user?: User;
  total?: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  industry?: string;
}

// Campaign types
export interface Campaign {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'lending' | 'recovery' | 'onboarding' | 'custom' | 'outbound';
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdById: string;
  agentId: string;
  startDate?: string;
  endDate?: string;
  dailyStartTime?: string;
  dailyEndTime?: string;
  maxAttempts: number;
  concurrentCalls: number;
  callbackSettings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Agent types
export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'loan_application' | 'recovery' | 'customer_service';
  voiceConfig: Record<string, any>;
  languageSettings: Record<string, any>;
  createdById: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

// Contact List types
export interface ContactList {
  id: string;
  organizationId: string;
  campaignId?: string;
  name: string;
  description?: string;
  createdById: string;
  totalContacts: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics types
export interface DashboardAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  pausedCampaigns: number;
  completedCampaigns: number;
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  totalDuration: number;
  averageDuration: number;
  completionRate: number;
  callsByStatus: Record<string, number>;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  engagementRate: number;
  averageDuration: number;
}

// Get stored token
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Set token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Get stored refresh token
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

// Set refresh token in localStorage
export const setRefreshToken = (refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// Remove tokens
export const removeTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Get stored user
export const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Set user in localStorage
export const setStoredUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Base fetch function with auth
const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse> => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API functions
export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse> => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store tokens and user data
    if (response.token) {
      setToken(response.token);
    }
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
    if (response.user) {
      setStoredUser(response.user);
    }
    
    return response;
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse> => {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store tokens and user data
    if (response.token) {
      setToken(response.token);
    }
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
    if (response.user) {
      setStoredUser(response.user);
    }
    
    return response;
  },

  refreshToken: async (): Promise<ApiResponse> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update tokens
    if (response.token) {
      setToken(response.token);
    }
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }

    return response;
  },

  logout: (): void => {
    removeTokens();
  },
};

// Campaign API functions
export const campaignApi = {
  getAll: async (): Promise<Campaign[]> => {
    const response = await apiFetch('/campaigns');
    return response.data || [];
  },

  getById: async (id: string): Promise<Campaign> => {
    const response = await apiFetch(`/campaigns/${id}`);
    return response.data || response;
  },

  create: async (campaignData: Partial<Campaign>): Promise<Campaign> => {
    const response = await apiFetch('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
    return response.campaign || response.data;
  },

  update: async (id: string, campaignData: Partial<Campaign>): Promise<Campaign> => {
    const response = await apiFetch(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
    return response.campaign || response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// Agent API functions
export const agentApi = {
  getAll: async (): Promise<Agent[]> => {
    const response = await apiFetch('/agents');
    return response.data || response;
  },

  getById: async (id: string): Promise<Agent> => {
    const response = await apiFetch(`/agents/${id}`);
    return response.data || response;
  },

  create: async (agentData: Partial<Agent>): Promise<Agent> => {
    const response = await apiFetch('/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
    return response.agent || response.data;
  },

  update: async (id: string, agentData: Partial<Agent>): Promise<Agent> => {
    const response = await apiFetch(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
    return response.agent || response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/agents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Contact List API functions
export const contactListApi = {
  getAll: async (): Promise<ContactList[]> => {
    const response = await apiFetch('/contact-lists');
    return response.data || response;
  },

  getById: async (id: string): Promise<ContactList> => {
    const response = await apiFetch(`/contact-lists/${id}`);
    return response.data || response;
  },

  create: async (contactListData: Partial<ContactList>): Promise<ContactList> => {
    const response = await apiFetch('/contact-lists', {
      method: 'POST',
      body: JSON.stringify(contactListData),
    });
    return response.contactList || response.data || response;
  },

  update: async (id: string, contactListData: Partial<ContactList>): Promise<ContactList> => {
    const response = await apiFetch(`/contact-lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactListData),
    });
    return response.contactList || response.data || response;
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/contact-lists/${id}`, {
      method: 'DELETE',
    });
  },
};

// Contact API functions
export const contactApi = {
  bulkImport: async (listId: string, contacts: any[]): Promise<any> => {
    const response = await apiFetch(`/contacts/list/${listId}/bulk-import`, {
      method: 'POST',
      body: JSON.stringify({ contacts }),
    });
    return response;
  },

  create: async (contactData: any): Promise<any> => {
    const response = await apiFetch('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
    return response.contact || response.data || response;
  },
};

// Call API functions
export const callApi = {
  create: async (callData: {
    campaignId: string;
    agentId: string;
    contactId: string;
    type: 'outbound' | 'inbound';
    scheduledAt?: Date;
    notes?: string;
  }): Promise<any> => {
    const response = await apiFetch('/calls', {
      method: 'POST',
      body: JSON.stringify(callData),
    });
    return response.call || response.data || response;
  },

  getAll: async (): Promise<any[]> => {
    const response = await apiFetch('/calls');
    return response.data || response;
  },
};

// Analytics API functions
export const analyticsApi = {
  getDashboardSummary: async (startDate: string, endDate: string): Promise<DashboardAnalytics> => {
    try {
      const response = await apiFetch(`/analytics/dashboard-summary?startDate=${startDate}&endDate=${endDate}`);
      return response.data || response;
    } catch (error) {
      // Return mock data if analytics endpoint doesn't exist
      console.warn('Analytics endpoint not available, returning mock data');
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        pausedCampaigns: 0,
        completedCampaigns: 0,
        totalCalls: 0,
        completedCalls: 0,
        failedCalls: 0,
        totalDuration: 0,
        averageDuration: 0,
        completionRate: 0,
        callsByStatus: {},
      };
    }
  },

  getCampaignPerformance: async (campaignId: string): Promise<CampaignPerformance> => {
    try {
      const response = await apiFetch(`/analytics/campaign/${campaignId}/performance`);
      return response.data || response;
    } catch (error) {
      // Return mock data if analytics endpoint doesn't exist
      console.warn('Campaign performance endpoint not available, returning mock data');
      return {
        campaignId,
        campaignName: 'Unknown Campaign',
        totalCalls: 0,
        completedCalls: 0,
        failedCalls: 0,
        engagementRate: 0,
        averageDuration: 0,
      };
    }
  },
};