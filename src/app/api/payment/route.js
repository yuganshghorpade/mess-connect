import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();

    const { type, duration } = await req.json();

    let multiplier = 1;
    if (duration === "monthly") {
      multiplier = 1;
    } else if (duration === "quarterly") {
      multiplier = 3;
    } else if (duration === "yearly") {
      multiplier = 12;
    }

    console.log("multiplier",multiplier);

    const order = await razorpay.orders.create({
      amount: 310000 * multiplier ,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        mealtype: type
      },
    });

    console.log("order",order);

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
