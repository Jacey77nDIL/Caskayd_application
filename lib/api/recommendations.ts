interface Niche {
  id: number;
  name: string;
}

interface Creator {
  id: number;
  name: string;
  bio: string;
  email: string;
  followers_count: number;
  engagement_rate: string;
  instagram_username: string | null;
  reach_7d: number | null;
  niches: Niche[];
  created_at: string;
}

interface RecommendationsResponse {
  success: boolean;
  data: {
    recommendations: Creator[];
    pagination: {
      offset: number;
      limit: number;
      returned_count: number;
      has_more: boolean;
    };
  };
  message: string;
}

export async function getRecommendations(params: {
  search?: string;
  location?: string;
  min_followers?: number;
  max_followers?: number;
  engagement_rate?: number;
  niches?: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const token = localStorage.getItem("jwt"); // adjust if using cookies or next-auth
    const query = new URLSearchParams(params as Record<string, string>).toString();

    const res = await fetch(`http://127.0.0.1:8000/recommendations?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: RecommendationsResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { success: false, data: null, message: error.message };
  }
}
