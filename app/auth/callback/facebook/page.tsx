"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FacebookCallback() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      // send code to backend to exchange for token
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Backend response:", data);
          // here you can store token or update state
          router.push("/WebCreatorHomeToDo");
        })
        .catch((err) => console.error("Error:", err));
    }
  }, [params, router]);

  return <p>Connecting your Instagram account...</p>;
}
