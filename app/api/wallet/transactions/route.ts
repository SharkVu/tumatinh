import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get recent transactions for the user (limit to last 10)
    const transactions = await db
      .collection("transactions")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
