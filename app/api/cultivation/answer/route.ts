import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { lessonId, answer, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Thiếu thông tin người dùng" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const lesson = await db.collection("lessons").findOne({ _id: new ObjectId(lessonId) })
    if (!lesson) {
      return NextResponse.json({ error: "Không tìm thấy bài học" }, { status: 404 })
    }

    const isCorrect = lesson.dapan === answer
    const reward = isCorrect ? lesson.reward || 50 : 0
    const tuviReward = isCorrect ? 50 : 0

    if (isCorrect && reward > 0) {
      await db.collection("users").updateOne(
        { userId: userId },
        {
          $inc: {
            linhthach: reward,
            tuvi: tuviReward,
          },
        },
      )

      await db.collection("transactions").insertOne({
        userId: userId,
        type: "earn",
        amount: reward,
        description: `Tu luyện: ${lesson.cauhoi?.substring(0, 30)}...`,
        createdAt: new Date().toISOString(),
      })

      if (tuviReward > 0) {
        await db.collection("transactions").insertOne({
          userId: userId,
          type: "earn",
          amount: tuviReward,
          description: `Tu Vi từ tu luyện: +${tuviReward}`,
          createdAt: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({
      correct: isCorrect,
      reward,
      tuviReward,
      message: isCorrect
        ? `Chính xác! Bạn nhận được ${reward} Linh Thạch và ${tuviReward} Tu Vi`
        : "Sai rồi, hãy thử lại!",
    })
  } catch (error) {
    console.error("Answer lesson error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
