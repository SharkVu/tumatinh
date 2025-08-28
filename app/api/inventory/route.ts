import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const inventory = await db.collection("khos").find({ userId }).toArray()

    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Inventory error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
