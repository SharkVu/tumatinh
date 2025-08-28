import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login API called")
    const { uid } = await request.json()
    console.log("[v0] Received UID:", uid)

    if (!uid) {
      console.log("[v0] No UID provided")
      return NextResponse.json({ error: "UID is required" }, { status: 400 })
    }

    console.log("[v0] Attempting MongoDB connection...")
    const { db } = await connectToDatabase()
    const users = db.collection("users")
    console.log("[v0] Connected to MongoDB successfully")

    console.log("[v0] Searching for user with UID:", uid)
    const user = await users.findOne({ userId: uid })
    console.log("[v0] User found:", user ? "Yes" : "No")

    if (!user) {
      console.log("[v0] User not found in database")
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    console.log("[v0] User data:", JSON.stringify(user, null, 2))
    const { password, ...userWithoutPassword } = user
    console.log("[v0] Returning user data without password")
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
