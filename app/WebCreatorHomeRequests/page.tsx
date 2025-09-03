"use client";
import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import TabsNavbar from "@/components/TabsNavbar";
import RequestCard from "@/components/RequestCard";
import RequestModal from "@/components/RequestModal";
import requests from "@/data/requests.json";


export default function HomeWebCreatorHomeRequestsPage() {
      const [selected, setSelected] = useState<any>(null);
    return(
        <div>
            <TopNavbar />
                  <TabsNavbar />
                  <div className="space-y-4 p-6">
      {requests.map((req) => (
        <RequestCard
          key={req.id}
          logo={req.logo}
          title={`${req.company}: ${req.title}`}
          onClick={() => setSelected(req)}
        />
      ))}

      <RequestModal
        show={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
      />
    </div>
        </div>
    )
}