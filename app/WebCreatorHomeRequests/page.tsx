"use client";

import { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import TabsNavbar from "@/components/TabsNavbar";
import RequestCard from "@/components/RequestCard";
import RequestModal from "@/components/RequestModal";
import requests from "@/data/requests.json";

export default function HomeWebCreatorHomeRequestsPage() {
  const [selected, setSelected] = useState<any>(null);

  return (
    // 1. Outer wrapper for full height and background consistency
    <div className="min-h-screen bg-gray-50">
      
      {/* Fixed Header */}
      <TopNavbar />

      {/* 2. Main content wrapper with Padding Top (pt-24) 
          This pushes the Tabs and Cards down so they are visible. */}
      <main className="pt-24">
        
        <TabsNavbar />

        {/* 3. Content Area - Added max-width for large screens */}
        <div className="space-y-4 p-6 max-w-7xl mx-auto">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              logo={req.logo}
              title={`${req.company}: ${req.title}`}
              price={req.price} 
              onClick={() => setSelected(req)}
            />
          ))}
        </div>

      </main>

      {/* Modal sits outside the main flow, so it can overlay everything */}
      <RequestModal
        show={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
      />
    </div>
  );
}