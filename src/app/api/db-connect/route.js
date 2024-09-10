import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    return NextResponse.json({
        message:"Server is running on port 8000"
    })
}