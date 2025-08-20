import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentKey: string }> }
) {
  try {
    const { paymentKey } = await params;

    // 토스페이먼츠 결제 상태 조회 API 호출
    const response = await fetch(
      `https://api.tosspayments.com/v1/payments/${paymentKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.TOSS_SECRET_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      { error: "결제 상태 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
