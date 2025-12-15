// src/lib/api/recommendations/recommendations.ts
import { getToken } from "@/utils/auth";

interface RecommendationParams {
  search?: string;
  offset?: number;
  limit?: number;
  platform?: string | null;
  followers?: string | null;
  reach?: string | null;
  price?: string | null;
}

interface ApiResponse {
  success: boolean;
  data: { recommendations: any[] }; // We force this structure for the frontend
  message?: string;
}

export async function getRecommendations(params: RecommendationParams = {}): Promise<ApiResponse> {
  const token = getToken();

  if (!token) {
    console.warn("No JWT token found");
    return { success: false, data: { recommendations: [] }, message: "Please log in again." };
  }

  // --- THE TRANSLATOR: Convert Frontend Filters to Backend Params ---
  const backendParams: Record<string, string> = {
    offset: (params.offset || 0).toString(),
    limit: (params.limit || 10).toString(),
  };

  if (params.search) backendParams.search = params.search;

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

  if (params.platform) {
    backendParams.niches = params.platform;
  }

  const query = new URLSearchParams(backendParams).toString();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  try {
    const res = await fetch(`http://127.0.0.1:8000/recommendations?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const rawData = await res.json();

    // DEBUG: Uncomment this to see exactly what your API returns in the browser console
    // console.log("API RAW RESPONSE:", rawData);

    if (!res.ok) {
      if (res.status === 401) {
        return { success: false, data: { recommendations: [] }, message: "Session expired." };
      }
      return { success: false, data: { recommendations: [] }, message: rawData.detail || `Error ${res.status}` };
    }

    // --- ROBUST DATA NORMALIZATION ---
    // We check multiple common places where the list might be hiding
    let creatorsList: any[] = [];

    if (Array.isArray(rawData)) {
      // Case 1: The API returns the array directly: [...]
      creatorsList = rawData;
    } else if (Array.isArray(rawData.recommendations)) {
      // Case 2: The API returns { recommendations: [...] }
      creatorsList = rawData.recommendations;
    } else if (Array.isArray(rawData.items)) {
      // Case 3: The API returns { items: [...] } (Common in FastAPI pagination)
      creatorsList = rawData.items;
    } else if (Array.isArray(rawData.data)) {
      // Case 4: The API returns { data: [...] }
      creatorsList = rawData.data;
    }

    // Return the structure exactly as WebExplore expects it
    return { 
      success: true, 
      data: { recommendations: creatorsList } 
    };

  } catch (err: any) {
    console.error("Fetch failed", err);
    return { success: false, data: { recommendations: [] }, message: "Network error." };
  }
}