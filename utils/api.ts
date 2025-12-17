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





// 1. Get Banks (Calls your Next.js API Route)
export const getBanks = async (): Promise<ApiResponse> => {
  try {
    // Note: No 'fetchWithAuth' needed here if it's a public endpoint, 
    // but keep it if you want to protect this route.
    const res = await fetch("/api/paystack/banks"); 
    const data = await res.json();

    if (data.status && Array.isArray(data.data)) {
      return { success: true, data: data.data };
    }
    throw new Error("Failed to load banks");
  } catch (error) {
    console.warn("Using fallback banks");
    return { 
      success: true, 
      data: [
         { name: "Access Bank", code: "044" },
         { name: "GTBank", code: "058" },
         { name: "UBA", code: "033" },
         { name: "Zenith Bank", code: "057" },
         { name: "Kuda", code: "50211" },
         { name: "OPay", code: "999992" }
      ] 
    };
  }
};

// 2. Resolve Account (Calls your Next.js API Route)
export const resolveBankAccount = async (accountNumber: string, bankCode: string): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `/api/paystack/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
    );
    const data = await res.json();
    
    if (data.status) {
       return { success: true, data: data.data };
    }
    return { success: false, message: "Could not resolve account" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ... inside utils/api.ts

export const submitAccountDetails = async (payload: { 
    account_name: string; 
    account_number: string; 
    bank_code: string; 
}): Promise<ApiResponse> => {
  try {
    // ---------------------------------------------------------
    // STEP 1: Create Paystack Recipient (via Next.js API Route)
    // ---------------------------------------------------------
    const paystackRes = await fetch("/api/paystack/create-recipient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.account_name,
        account_number: payload.account_number,
        bank_code: payload.bank_code
      }),
    });
    
    const paystackData = await paystackRes.json();

    // If Paystack fails, stop here and return the error
    if (!paystackData.status) {
      return { 
        success: false, 
        message: paystackData.message || "Failed to create Paystack recipient" 
      };
    }

    // ---------------------------------------------------------
    // STEP 2: Submit Details + Recipient Code to Python Backend
    // ---------------------------------------------------------
    // We use 'fetchWithAuth' here because your backend requires 
    // the Bearer token (as seen in your 401 error snippet).
    
    const recipientCode = paystackData.data.recipient_code;

    const backendRes = await fetchWithAuth("/creator/submit-account", {
      method: "POST",
      body: JSON.stringify({
        account_name: payload.account_name,
        account_number: payload.account_number,
        bank_code: payload.bank_code,
        //recipient_code: recipientCode // ✅ Added as requested
      }),
    });
    console.log(recipientCode)
    return { success: true, data: backendRes };

  } catch (error) {
    console.error("Submit Account Error:", error);
    return { success: false, message: (error as Error).message };
  }
};