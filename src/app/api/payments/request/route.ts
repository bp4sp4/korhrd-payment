import { NextRequest, NextResponse } from "next/server";
import { TossPaymentRequest } from "@/types/toss";

export async function POST(request: NextRequest) {
  try {
    const body: TossPaymentRequest = await request.json();

    const {
      amount,
      orderId,
      orderName,
      customerName,
      customerEmail,
      successUrl,
      failUrl,
      method,
    } = body;

    // 환경 변수 확인
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error("TOSS_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "서버 설정 오류: TOSS_SECRET_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    console.log("Payment request data (결제위젯 v2):", {
      amount,
      orderId,
      orderName,
      customerName,
      customerEmail,
      successUrl,
      failUrl,
      method,
    });

    // 토스페이먼츠 결제위젯 v2 API 요청 데이터 구성
    const tossRequestData: Record<string, unknown> = {
      amount: {
        currency: "KRW",
        value: amount,
      },
      orderId,
      orderName,
      customerName,
      customerEmail,
      successUrl,
      failUrl,
    };

    // 결제 수단에 따른 설정
    if (method === "VIRTUAL_ACCOUNT") {
      // 무통장입금 설정 (결제위젯 v2)
      tossRequestData.method = "VIRTUAL_ACCOUNT";
      tossRequestData.virtualAccount = {
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 7일 후 만료 (YYYY-MM-DD 형식)
        cashReceipt: {
          type: "소득공제",
        },
        useEscrow: false,
      };
    } else {
      // 카드 결제 (기본값)
      tossRequestData.method = "CARD";
    }

    console.log("Toss 결제위젯 v2 API request data:", tossRequestData);
    console.log(
      "Toss API secret key (first 10 chars):",
      secretKey.substring(0, 10) + "..."
    );
    console.log("환경변수 출처: .env 파일 (서버사이드)");

    // Authorization 헤더 생성
    const authHeader = `Basic ${Buffer.from(secretKey + ":").toString(
      "base64"
    )}`;
    console.log(
      "Authorization header (first 20 chars):",
      authHeader.substring(0, 20) + "..."
    );

    // 토스페이먼츠 v2 결제 요청 API 호출
    const response = await fetch("https://api.tosspayments.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tossRequestData),
    });

    console.log("Toss 결제위젯 v2 API response status:", response.status);
    console.log(
      "Toss API response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "응답을 파싱할 수 없습니다." };
      }
      console.error("Toss 결제위젯 v2 API error:", errorData);
      return NextResponse.json(
        {
          error: "결제 요청에 실패했습니다.",
          details: errorData.message || errorData.error || "알 수 없는 오류",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Toss 결제위젯 v2 API success response:", data);
    console.log("Toss API response keys:", Object.keys(data));
    console.log("Toss API checkout.url:", data.checkout?.url);
    console.log("Toss API paymentKey:", data.paymentKey);

    // 응답 데이터 검증
    if (!data.checkout?.url) {
      console.error("Toss API response missing checkout.url:", data);
      return NextResponse.json(
        {
          error: "토스페이먼츠에서 결제 URL을 반환하지 않았습니다.",
          details: "checkout.url이 응답에 없습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentUrl: data.checkout.url,
      paymentKey: data.paymentKey,
    });
  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json(
      { error: "결제 요청 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
