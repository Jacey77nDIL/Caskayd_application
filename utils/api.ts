import { getToken } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// --- TYPES ---

export interface FiltersState {
  platform: string | null;
  reach: string | null;
  price: string | null;
  followers: string | null;
}

export interface Creator {
  id: number;
  name: string;
  followers_count: number;
  engagement_rate: string;
  instagram_username?: string | null;
  reach_7d?: number | null;
  niches: {
    id: number;
    name: string;
  }[];
}

// Generic Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  url?: string;
}

// --- HELPER: Consistent Fetching ---
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const res = await fetch(`${API_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || errorBody.message || `Request failed with status ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

// ==========================================
// 1. ONBOARDING & PROFILE
// ==========================================

export const getIndustries = async (): Promise<ApiResponse> => {
  try {
    const response = await fetchWithAuth("/industries", { method: "GET" });
    if (response?.data?.industries) {
      return { success: true, data: { industries: response.data.industries } };
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to fetch industries:", error);
    return { success: false, message: (error as Error).message };
  }
};

export const setupBusinessProfile = async (industryIds: number[]): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/profile/business/setup", { 
      method: "POST",
      body: JSON.stringify(industryIds) 
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to setup profile:", error);
    return { success: false, message: (error as Error).message };
  }
};

// ==========================================
// 2. RECOMMENDATIONS
// ==========================================

export const getRecommendations = async (params: Record<string, string | number> = {}): Promise<ApiResponse> => {
  try {
    const backendParams: Record<string, string> = {
      offset: (params.offset || 0).toString(),
      limit: (params.limit || 10).toString(),
    };

    if (params.search) backendParams.search = String(params.search);
    if (params.followers) {
      if (params.followers === "1k-10k") {
        backendParams.min_followers = "1000";
        backendParams.max_followers = "10000";
      } else if (params.followers === "10k-50k") {
        backendParams.min_followers = "10000";
        backendParams.max_followers = "50000";
      } else if (params.followers === "50k+") {
        backendParams.min_followers = "50000";
      }
    }
    if (params.platform) backendParams.niches = String(params.platform);

    const query = new URLSearchParams(backendParams).toString();
    const rawData = await fetchWithAuth(`/recommendations?${query}`, { method: "GET" });

    let creatorsList: Creator[] = [];

    if (rawData?.data && Array.isArray(rawData.data.recommendations)) {
       creatorsList = rawData.data.recommendations;
    } 
    else if (Array.isArray(rawData)) {
       creatorsList = rawData;
    }
    else if (Array.isArray(rawData.recommendations)) {
       creatorsList = rawData.recommendations;
    }
    else if (Array.isArray(rawData.data)) {
       creatorsList = rawData.data;
    }

    return { 
      success: true, 
      data: { 
        recommendations: creatorsList, 
        pagination: rawData.data?.pagination || rawData.pagination || {} 
      } 
    };

  } catch (error) {
    console.error("Failed to get recommendations:", error);
    return { success: false, message: (error as Error).message };
  }
};

// ==========================================
// 3. CAMPAIGNS
// ==========================================

export const getCampaigns = async (): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/campaigns", { method: "GET" });
    const campaigns = Array.isArray(data) ? data : (data?.data || []);
    return { success: true, data: campaigns };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getCampaignById = async (id: string | number): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth(`/campaigns/${id}`, { method: "GET" });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const createCampaign = async (payload: Record<string, unknown>): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/campaigns", { 
      method: "POST",
      body: JSON.stringify(payload)
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const deleteCampaign = async (id: number): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth(`/campaigns/${id}`, { method: "DELETE" });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ==========================================
// 4. CAMPAIGN CREATORS & INVITES
// ==========================================

export const addCreatorToCampaign = async (campaignId: string | number, creatorId: number): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth(`/campaigns/${campaignId}/creators`, {
      method: "POST",
      body: JSON.stringify({ creator_ids: [creatorId], notes: "" }),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const removeCreatorFromCampaign = async (campaignId: string | number, creatorId: string | number): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth(`/campaigns/${campaignId}/creators/${creatorId}`, {
      method: "DELETE",
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const inviteCreators = async (campaignId: number | string, creatorIds: number[]): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth(`/campaigns/${campaignId}/invite`, {
      method: "POST",
      body: JSON.stringify({ creator_ids: creatorIds }),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ==========================================
// 5. CHAT
// ==========================================
export async function getConversations() {
  try { return await fetchWithAuth("/chat/conversations", { method: "GET" }); }
  catch { return []; } 
}
export async function getConversationDetail(id: number) {
  try { return await fetchWithAuth(`/chat/conversations/${id}`, { method: "GET" }); }
  catch { return null; } 
}
export async function sendMessage(id: number | string, content: string) {
  try { return await fetchWithAuth("/chat/messages", { method: "POST", body: JSON.stringify({ conversation_id: id, content, file_url: null, file_type: null }) }); }
  catch (e) { throw e; }
}
export async function markConversationAsRead(id: number | string) {
  try { return await fetchWithAuth(`/chat/conversations/${id}/read`, { method: "PUT" }); }
  catch { return null; } 
}

// ==========================================
// 6. AUTH & USER
// ==========================================
export const getCurrentUser = async (): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/get_current_user", { method: "GET" });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get user:", error);
    return { success: false, message: "Network error" };
  }
};

export const getTikTokAuthUrl = async (): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/auth/tiktok/start", { method: "GET" });
    return { success: true, url: data.authorization_url };
  } catch (error) {
    console.error("Failed to start TikTok auth:", error);
    return { success: false, message: (error as Error).message };
  }
};

export const loginUser = async (credentials: Record<string, string>): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/login", { 
      method: "POST", 
      body: JSON.stringify(credentials) 
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const signupCreator = async (payload: Record<string, unknown>): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/signup/creator", { 
      method: "POST", 
      body: JSON.stringify(payload) 
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const setupCreatorProfile = async (payload: Record<string, unknown>): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/profile/creator/setup", { 
      method: "POST", 
      body: JSON.stringify(payload) 
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getNiches = async (): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/niches", { method: "GET" });
    const niches = data?.data?.niches || data || [];
    return { success: true, data: niches };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ==========================================
// 7. ACCOUNT DETAILS (CORRECTED)
// ==========================================

export const submitAccountDetails = async (payload: { account_name: string; account_number: string; bank_code: string }): Promise<ApiResponse> => {
  try {
    // Note: fetchWithAuth automatically adds the Bearer Token and Content-Type header
    const data = await fetchWithAuth("/creator/submit-account", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ... inside @/utils/api.ts

// ✅ NEW: Fetch Banks (with fallback)
export const getBanks = async (): Promise<ApiResponse> => {
  try {
    // Try to fetch from your backend first
    const data = await fetchWithAuth("/misc/banks", { method: "GET" });
    const bankList = data?.data || data || [];
    
    // Validate we actually got an array
    if (Array.isArray(bankList) && bankList.length > 0) {
      return { success: true, data: bankList };
    }
    throw new Error("No banks found");
  } catch (error) {
    console.warn("Could not fetch live banks, using fallback list.");
    // Fallback list so the UI never breaks
    const FALLBACK_BANKS = [
      { name: "Access Bank", code: "044" },
      { name: "Guaranty Trust Bank", code: "058" },
      { name: "United Bank for Africa", code: "033" },
      { name: "Zenith Bank", code: "057" },
      { name: "First Bank of Nigeria", code: "011" },
      { name: "Kuda Bank", code: "50211" },
      { name: "OPay", code: "999992" },
      { name: "PalmPay", code: "999991" },
      { name: "Moniepoint", code: "50515" },
      { name: "Stanbic IBTC Bank", code: "221" },
      { name: "Sterling Bank", code: "232" },
      { name: "Union Bank of Nigeria", code: "032" },
      { name: "Fidelity Bank", code: "070" },
      { name: "Ecobank Nigeria", code: "050" },
    ];
    return { success: true, data: FALLBACK_BANKS };
  }
};