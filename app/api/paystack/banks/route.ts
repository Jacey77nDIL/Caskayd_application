import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.paystack.co/bank?currency=NGN", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: false, message: "Failed to fetch banks" }, { status: 500 });
  }
}