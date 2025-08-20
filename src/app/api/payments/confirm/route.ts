import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    console.log("결제 정보 조회 요청:", { paymentKey, orderId, amount });

    // 사용자의 토스페이먼츠 시크릿 키
    const secretKey = process.env.TOSS_SECRET_KEY;

    console.log("=== 토스페이먼츠 시크릿 키 확인 ===");
    console.log(
      "환경 변수 TOSS_SECRET_KEY:",
      secretKey ? `${secretKey.substring(0, 10)}...` : "undefined"
    );
    console.log("환경 변수 타입:", typeof secretKey);
    console.log("환경 변수 길이:", secretKey?.length);

    if (!secretKey) {
      console.error("❌ TOSS_SECRET_KEY가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "토스페이먼츠 시크릿 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    if (!secretKey.startsWith("test_sk_")) {
      console.error(
        "❌ 잘못된 시크릿 키 형식:",
        secretKey ? `${secretKey.substring(0, 10)}...` : "undefined"
      );
      return NextResponse.json(
        { error: "토스페이먼츠 시크릿 키 형식이 올바르지 않습니다." },
        { status: 500 }
      );
    }

    console.log("✅ 토스페이먼츠 시크릿 키 확인 완료");

    // 토스페이먼츠 v2 결제 조회 API 호출 (무통장입금의 경우 승인이 아닌 조회만)
    const response = await fetch(
      `https://api.tosspayments.com/v2/payments/${paymentKey}`,
      {
        method: "GET", // GET으로 변경 - 조회만
        headers: {
          Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
        // body 제거 - GET 요청이므로
      }
    );

    console.log("토스페이먼츠 API 응답 상태:", response.status);
    console.log(
      "토스페이먼츠 API 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.status === 404) {
      // 무통장입금의 경우 404는 정상적인 상황
      // 사용자가 아직 입금하지 않았거나, 결제가 만료된 경우
      console.log(
        "404 오류 - 무통장입금 결제 정보를 찾을 수 없음. 정상적인 상황일 수 있습니다."
      );

      return NextResponse.json(
        {
          success: false,
          message: "무통장입금 결제 정보를 찾을 수 없습니다.",
          details:
            "사용자가 아직 입금하지 않았거나, 결제가 만료되었을 수 있습니다.",
          paymentStatus: "PENDING", // 대기 중 상태
          method: "VIRTUAL_ACCOUNT",
        },
        { status: 200 } // 200으로 응답하여 클라이언트에서 정상 처리
      );
    }

    if (!response.ok) {
      console.error("토스페이먼츠 API 오류 상태:", response.status);
      let errorMessage = "토스페이먼츠 API 오류";

      try {
        // 응답이 비어있지 않은 경우에만 JSON 파싱 시도
        const responseText = await response.text();
        console.log("토스페이먼츠 API 응답 텍스트:", responseText);

        if (responseText.trim()) {
          const error = JSON.parse(responseText);
          console.error("토스페이먼츠 API 오류:", error);
          errorMessage = error.message || error.error || errorMessage;
        } else {
          console.log("토스페이먼츠 API 응답이 비어있음");
        }
      } catch (parseError) {
        console.error("토스페이먼츠 API 응답 파싱 오류:", parseError);
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // 성공적인 응답 처리
    let paymentData;
    try {
      const responseText = await response.text();
      console.log("토스페이먼츠 API 성공 응답 텍스트:", responseText);

      if (responseText.trim()) {
        paymentData = JSON.parse(responseText);
      } else {
        console.log("토스페이먼츠 API 성공 응답이 비어있음");
        paymentData = {
          paymentKey,
          orderId,
          amount,
          status: "DONE",
          method: "VIRTUAL_ACCOUNT",
        };
      }
    } catch (parseError) {
      console.error("토스페이먼츠 API 성공 응답 파싱 오류:", parseError);
      paymentData = {
        paymentKey,
        orderId,
        amount,
        status: "DONE",
        method: "VIRTUAL_ACCOUNT",
      };
    }

    console.log("토스페이먼츠 결제 정보 조회 응답:", {
      status: paymentData.status,
      method: paymentData.method,
      virtualAccount: paymentData.virtualAccount ? "있음" : "없음",
    });

    // 무통장입금의 경우 상태 확인 및 강제 수정
    if (
      paymentData.method === "VIRTUAL_ACCOUNT" ||
      paymentData.method === "가상계좌"
    ) {
      console.log("무통장입금 정보 조회 완료 - 원본 상태:", paymentData.status);

      // 무통장입금은 강제로 WAITING_FOR_DEPOSIT 상태로 설정
      // (토스페이먼츠에서 DONE으로 와도 클라이언트에서는 대기 상태로 표시)
      paymentData.status = "WAITING_FOR_DEPOSIT";

      console.log("무통장입금 상태를 WAITING_FOR_DEPOSIT으로 강제 설정");
      console.log("무통장입금 대기 중 - 가상계좌 정보:", {
        bankCode: paymentData.virtualAccount?.bankCode,
        accountNumber: paymentData.virtualAccount?.accountNumber,
        dueDate: paymentData.virtualAccount?.dueDate,
      });
    }

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error("결제 승인 오류:", error);
    return NextResponse.json(
      { error: "결제 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
