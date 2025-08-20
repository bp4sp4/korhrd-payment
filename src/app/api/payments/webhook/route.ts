import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 웹훅 이벤트 타입 확인
    const eventType = body.eventType;

    console.log("토스페이먼츠 웹훅 수신:", {
      eventType,
      paymentKey: body.data?.paymentKey,
      orderId: body.data?.orderId,
      status: body.data?.status,
    });

    // DEPOSIT_CALLBACK 이벤트 처리 (무통장입금 완료)
    if (eventType === "DEPOSIT_CALLBACK") {
      const paymentData = body.data;

      // secret 값 검증 (보안을 위해 실제 구현에서는 더 엄격하게 검증)
      if (paymentData.secret) {
        console.log("무통장입금 완료:", {
          paymentKey: paymentData.paymentKey,
          orderId: paymentData.orderId,
          status: paymentData.status,
          amount: paymentData.amount,
        });

        // 여기서 결제 완료 처리 로직 구현
        // 예: 데이터베이스 업데이트, 이메일 발송, 서비스 활성화 등

        return NextResponse.json({ success: true });
      }
    }

    // PAYMENT_STATUS_CHANGED 이벤트 처리 (결제 상태 변경)
    if (eventType === "PAYMENT_STATUS_CHANGED") {
      const paymentData = body.data;

      console.log("결제 상태 변경:", {
        paymentKey: paymentData.paymentKey,
        orderId: paymentData.orderId,
        status: paymentData.status,
      });

      // 결제 상태에 따른 처리
      switch (paymentData.status) {
        case "DONE":
          console.log("결제 완료 처리");
          // 결제 완료 로직
          break;
        case "CANCELED":
          console.log("결제 취소 처리");
          // 결제 취소 로직
          break;
        case "WAITING_FOR_DEPOSIT":
          console.log("입금 대기 중");
          // 입금 대기 로직
          break;
        default:
          console.log("기타 상태:", paymentData.status);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("웹훅 처리 오류:", error);
    return NextResponse.json(
      { error: "웹훅 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
