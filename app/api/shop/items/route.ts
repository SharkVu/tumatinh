import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("tutien")

    const items = await db.collection("shopItems").find({}).toArray()

    return NextResponse.json(items)
  } catch (error) {
    console.error("Shop items error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
