"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function FacebookCallbackInner() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");

    if (!code) return;

    const exchangeCode = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        console.log("Backend response:", data);

        // store token if backend sends it back
        // localStorage.setItem("token", data.token);

        router.push("/WebCreatorHomeToDo");
      } catch (err) {
        console.error("Error exchanging Facebook code:", err);
      }
    };

    exchangeCode();
  }, [params, router]);

  return <p>Connecting your Instagram account...</p>;
}

export default function FacebookCallback() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FacebookCallbackInner />
    </Suspense>
  );
}
