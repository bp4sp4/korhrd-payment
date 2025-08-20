import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ paymentKey: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { paymentKey } = await params;
    console.log("결제 상태 확인 요청:", { paymentKey });

    // 사용자의 토스페이먼츠 시크릿 키
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      console.error("TOSS_SECRET_KEY가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "토스페이먼츠 시크릿 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.tosspayments.com/v2/payments/${paymentKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("토스페이먼츠 API 오류:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const data = await response.json();
    console.log("결제 상태 확인 응답:", {
      status: data.status,
      method: data.method,
      orderId: data.orderId,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("결제 상태 확인 오류:", error);
    return NextResponse.json(
      { error: "결제 상태 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
