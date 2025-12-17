// app/api/verify-payment/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({ success: false, message: "Reference missing" }, { status: 400 });
    }

    // 1. Call Paystack API from SERVER (Secure)
    // NEVER put PAYSTACK_SECRET_KEY in next.config.js public vars
    const secretKey = process.env.PAYSTACK_SECRET_KEY; 
    
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await verifyResponse.json();

    // 2. Check if Paystack says "success"
    if (data.status && data.data.status === "success") {
      // 3. OPTIONAL: Check if amount matches what you expected
      // if (data.data.amount < expectedAmount) return error...

      // 4. GIVE VALUE: Update database, mark order as paid, etc.
      // await db.orders.update(...) 

      return NextResponse.json({ success: true, message: "Payment Verified" });
    } else {
      return NextResponse.json({ success: false, message: "Payment Verification Failed" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}