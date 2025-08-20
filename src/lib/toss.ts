import { TossPaymentRequest, TossPaymentResponse } from "@/types/toss";

export class TossPaymentService {
  private clientKey: string;
  private secretKey: string;

  constructor() {
    this.clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
    this.secretKey = process.env.TOSS_SECRET_KEY || "";
  }

  async requestPayment(paymentData: TossPaymentRequest): Promise<string> {
    console.log("TossPaymentService: Making payment request to API");

    // 현재 실행 중인 포트에 맞게 API URL 설정
    const apiUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/payments/request`
        : "/api/payments/request";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    console.log("TossPaymentService: API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("TossPaymentService: API error response:", errorData);

      // 더 자세한 오류 메시지 구성
      let errorMessage = "결제 요청에 실패했습니다.";
      if (errorData.details) {
        errorMessage = `${errorMessage} (${errorData.details})`;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("TossPaymentService: API success response:", data);
    console.log("TossPaymentService: Response data keys:", Object.keys(data));
    console.log("TossPaymentService: paymentUrl value:", data.paymentUrl);
    console.log("TossPaymentService: checkout.url value:", data.checkout?.url);

    // paymentUrl이 없으면 checkout.url을 사용
    const paymentUrl = data.paymentUrl || data.checkout?.url;

    if (!paymentUrl) {
      console.error(
        "TossPaymentService: No payment URL found in response:",
        data
      );
      throw new Error(
        "결제 URL을 받지 못했습니다. 응답 데이터를 확인해주세요."
      );
    }

    return paymentUrl;
  }

  async confirmPayment(
    paymentKey: string,
    orderId: string,
    amount: number
  ): Promise<TossPaymentResponse> {
    const apiUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/payments/confirm`
        : "/api/payments/confirm";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "결제 확인에 실패했습니다.");
    }

    return response.json();
  }

  async getPaymentStatus(paymentKey: string): Promise<TossPaymentResponse> {
    const apiUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/payments/status/${paymentKey}`
        : `/api/payments/status/${paymentKey}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "결제 상태 조회에 실패했습니다.");
    }

    return response.json();
  }

  generateOrderId(): string {
    // 토스페이먼츠 권장 형식: 영문, 숫자, 언더스코어만 사용, 최대 64자
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `order_${timestamp}_${randomStr}`;
  }
}

export const tossPayment = new TossPaymentService();
