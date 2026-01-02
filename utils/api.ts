  //utils/api
  import { getToken } from "@/utils/auth";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  // --- TYPES ---

export interface FiltersState {
  niche: string | null;
  reach: string | null;
  followers: string | null;
  engagement_rate: string | null; // ADDED (Removed price)
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
export interface NicheOption {
  id: number;
  name: string;
}

export interface CampaignInvitation {
  id: number;
  campaign_id: number;
  campaign_title: string;
  campaign_description: string;
  campaign_budget: number;
  campaign_start_date: string;
  campaign_end_date: string;
  business_name: string;
  status: "invited" | "accepted" | "declined";
  invited_at: string;
  responded_at?: string | null;
  // New Fields
  campaign_image?: string | null;
  campaign_brief_file_url?: string | null;
}
  // --- HELPER: Consistent Fetching ---
// utils/api.ts

// ...

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
    
    // ✅ FIX: Handle FastAPI 422 Validation Arrays gracefully
    let errorMessage = errorBody.message || "Request failed";
    
    if (errorBody.detail) {
      if (Array.isArray(errorBody.detail)) {
        // It's a validation error list, join the messages
        errorMessage = errorBody.detail
          .map((err: any) => `${err.loc[1]}: ${err.msg}`)
          .join(" | ");
      } else {
        // It's a simple string error
        errorMessage = errorBody.detail;
      }
    }
    
    throw new Error(errorMessage);
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
// utils/api.ts

export const getCampaignInvitations = async (status?: string): Promise<ApiResponse> => {
  try {
    const query = status ? `?status=${status}` : "";
    const response = await fetchWithAuth(`/campaigns/invitations${query}`, { method: "GET" });
    
    // ✅ FIX: Handle the new nested structure { data: { invitations: [] } }
    if (response.success && response.data?.invitations) {
       return { success: true, data: response.data.invitations };
    }
    
    // Fallback for older structure
    if (response.success && Array.isArray(response.data)) {
       return { success: true, data: response.data };
    }
    
    return { success: true, data: [] }; 
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    return { success: false, message: (error as Error).message };
  }
};
export const uploadProfilePicture = async (file: File) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload/creator-profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, message: errorData.detail || "Upload failed" };
    }

    // ✅ FIX: Handle both JSON objects and plain text URLs
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text(); // Fallback for plain text response
        // Clean up quotes if they exist (e.g. "http://..." -> http://...)
        if (data.startsWith('"') && data.endsWith('"')) {
            data = data.slice(1, -1);
        }
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, message: "Network error during upload" };
  }
};

  export const getAvailableNiches = async (): Promise<ApiResponse> => {
  try {
    // Endpoint: /recommendations/filters/niches
    const response = await fetchWithAuth("/recommendations/filters/niches", { method: "GET" });
    
    // Normalize response: ensure we return a clean array of niches
    const list = response?.data?.niches || response?.data || [];
    return { success: true, data: list };
  } catch (error) {
    console.error("Failed to fetch niches:", error);
    return { success: false, message: (error as Error).message };
  }
};

// ==========================================
// RECOMMENDATIONS (Updated)
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



  // ==========================================
  // 3. CAMPAIGNS
  // ==========================================



  export const getCampaignById = async (id: string | number): Promise<ApiResponse> => {
    try {
      const data = await fetchWithAuth(`/campaigns/${id}`, { method: "GET" });
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

// utils/api.ts

// ... existing imports and types ...

// utils/api.ts

// ... (keep all the code above unchanged) ...

export async function acceptCampaignInvitation(campaignId: number) {
  try {
    // ✅ FIX: Use fetchWithAuth so the Token is sent automatically
    const res = await fetchWithAuth(`/campaigns/${campaignId}/accept`, {
      method: "POST",
    });

    // fetchWithAuth automatically parses JSON, so we just check if it returned valid data
    // If fetchWithAuth throws an error (e.g. 401 or 422), it goes to the catch block.
    
    return { success: true, message: "Campaign accepted successfully", data: res };

  } catch (error) {
    // fetchWithAuth throws errors with the backend message, so we capture it here
    return { success: false, message: (error as Error).message || "Failed to accept" };
  }
}

export async function declineCampaignInvitation(campaignId: number) {
  try {
    // ✅ FIX: Use fetchWithAuth here too
    const res = await fetchWithAuth(`/campaigns/${campaignId}/decline`, {
      method: "POST",
    });

    return { success: true, message: "Campaign declined", data: res };

  } catch (error) {
    return { success: false, message: (error as Error).message || "Failed to decline" };
  }
}

// 1. ADD: Function to upload the brief


// 2. ADD: Function to update the campaign (PUT)


export const getCreatorProfile = async (): Promise<ApiResponse> => {
  try {
    const response = await fetchWithAuth("/creator/profile", { method: "GET" });
    // Normalize: if response.data exists, return it, otherwise return response directly if structure varies
    return { 
        success: true, 
        data: response.data || response 
    };
  } catch (error) {
    console.error("Failed to fetch creator profile:", error);
    return { success: false, message: (error as Error).message };
  }
};





// ✅ FIXED: Removes hardcoded values and maps dynamic Socials/Category
export const updateBusinessProfile = async (payload: any): Promise<ApiResponse> => {
  try {
    const backendPayload = {
      // 1. Direct Mappings
      email: payload.email, 
      business_name: payload.name, 
      business_bio: payload.bio,
      website_url: payload.website,
      // 2. Dynamic Category (Fix: Was hardcoded to "Business")
      category: payload.category, 
      // 3. Dynamic Socials (Fix: Was expecting 'twitter' string, now accepts the full object)
      socials: payload.socials,
      // 4. Password (Only include if it exists in payload)
      ...(payload.password ? { password: payload.password } : {})
    };

    console.log("Sending Update Payload:", backendPayload); // Check your console to verify!

    const res = await fetchWithAuth("/profile/business/edit", {
      method: "PUT",
      body: JSON.stringify(backendPayload),
    });
    
    return { success: true, data: res };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};


export const getCampaigns = async (): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth("/campaigns", { method: "GET" });
    const campaigns = Array.isArray(data) ? data : (data?.data || []);
    return { success: true, data: campaigns };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

/**
 * Creates a new campaign draft.
 */
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

/**
 * Updates an existing campaign.
 */
export const updateCampaign = async (id: number, payload: any): Promise<ApiResponse> => {
  try {
    const res = await fetchWithAuth(`/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return { success: true, data: res };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

/**
 * Deletes a campaign by ID.
 */
export const deleteCampaign = async (id: number): Promise<ApiResponse> => {
  try {
    const data = await fetchWithAuth(`/campaigns/${id}`, { method: "DELETE" });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// --- FILE UPLOAD ENDPOINTS ---

/**
 * Uploads a brief (PDF/Doc) for a specific campaign.
 */
export const uploadCampaignBrief = async (campaignId: number, file: File): Promise<ApiResponse> => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/upload/campaign-brief?campaign_id=${campaignId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("File upload failed");
    return await res.json();
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

/**
 * [NEW] Uploads a cover image for a specific campaign.
 */
export const uploadCampaignImage = async (campaignId: number, file: File): Promise<ApiResponse> => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/upload/campaign-image?campaign_id=${campaignId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");
    return await res.json();
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
// --- RECOMMENDATION ENDPOINTS ---

/**
 * Fetches creator recommendations based on filters.
 */
export const getRecommendations = async (params: Record<string, string | number> = {}): Promise<ApiResponse> => {
  try {
    const backendParams: Record<string, string> = {
      offset: (params.offset || 0).toString(),
      limit: (params.limit || 20).toString(),
    };

    if (params.niche) backendParams.niches = String(params.niche);
    // Add other filters as needed

    const query = new URLSearchParams(backendParams).toString();
    const rawData = await fetchWithAuth(`/recommendations?${query}`, { method: "GET" });

    // ✅ ROBUST NORMALIZATION: Handle if data is array OR nested object
    let creatorsList = [];
    
    // Case 1: Response is { success: true, data: [...] }
    if (Array.isArray(rawData.data)) {
      creatorsList = rawData.data;
    } 
    // Case 2: Response is { success: true, data: { recommendations: [...] } }
    else if (rawData.data?.recommendations) {
      creatorsList = rawData.data.recommendations;
    }
    // Case 3: Response is directly the array (rare but safe to check)
    else if (Array.isArray(rawData)) {
      creatorsList = rawData;
    }

    return { success: true, data: creatorsList };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

/**
 * Invites a list of creators to a campaign.
 */
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