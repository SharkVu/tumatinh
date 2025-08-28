// app/api/user/update-bank-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Cho phép CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Xử lý preflight request (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Thêm header CORS
    const headers = corsHeaders;

    // Parse JSON body
    const body = await request.json();
    console.log("Request body:", body);

    const { userId, accountNumber, bankName, accountHolder } = body;

    // Validate
    if (!userId) {
      return NextResponse.json(
        { error: "Thiếu userId" },
        { status: 400, headers }
      );
    }

    if (!accountNumber || !bankName || !accountHolder) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin ngân hàng" },
        { status: 400, headers }
      );
    }

    // Kết nối MongoDB
    const client = await clientPromise;
    const db = client.db("tutien");

    // Cập nhật hoặc tạo mới document
    await db.collection("bankings").updateOne(
      { userId },
      {
        $set: {
          userId,
          accountNumber,
          bankName,
          accountHolder,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Cập nhật thông tin ngân hàng thành công" },
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error("Update bank info error:", error);
    return NextResponse.json(
      { error: "Lỗi server: " + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
