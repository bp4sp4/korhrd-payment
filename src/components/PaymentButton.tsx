"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

interface PaymentButtonProps {
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail: string;
  className?: string;
  selectedMethods?: string[];
  onSuccess?: (paymentKey: string) => void;
  onError?: (error: string) => void;
}

export function PaymentButton({
  amount,
  orderName,
  customerName,
  customerEmail,
  className,
  selectedMethods = ["CARD"],
  onError,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  // 토스페이먼츠 SDK 초기화
  useEffect(() => {
    async function initializeTossPayments() {
      try {
        // 사용자의 토스페이먼츠 API 키
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

        console.log("=== 토스페이먼츠 API 키 확인 ===");
        console.log("환경 변수 NEXT_PUBLIC_TOSS_CLIENT_KEY:", clientKey);
        console.log("환경 변수 타입:", typeof clientKey);
        console.log("환경 변수 길이:", clientKey?.length);

        if (!clientKey) {
          console.error(
            "❌ NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다."
          );
          onError?.("토스페이먼츠 API 키가 설정되지 않았습니다.");
          return;
        }

        if (!clientKey.startsWith("test_ck_")) {
          console.error("❌ 잘못된 클라이언트 키 형식:", clientKey);
          onError?.("토스페이먼츠 API 키 형식이 올바르지 않습니다.");
          return;
        }

        console.log("✅ 토스페이먼츠 API 키 확인 완료:", clientKey);
        console.log("토스페이먼츠 SDK 초기화 시작...");

        const tossPayments = await loadTossPayments(clientKey);
        console.log("토스페이먼츠 SDK 로드 완료:", tossPayments);

        // 비회원 결제로 설정
        const paymentInstance = tossPayments.payment({
          customerKey: ANONYMOUS,
        });

        console.log("토스페이먼츠 결제 인스턴스 생성 완료:", paymentInstance);

        setPayment(paymentInstance);
        console.log("✅ 토스페이먼츠 SDK 초기화 완료!");
      } catch (error) {
        console.error("❌ 토스페이먼츠 SDK 초기화 오류:", error);
        if (error instanceof Error) {
          console.error("초기화 오류 상세:", error.stack);
        }
        onError?.("토스페이먼츠 SDK 초기화에 실패했습니다.");
      }
    }

    initializeTossPayments();
  }, [onError]);

  const handlePayment = async () => {
    if (selectedMethods.length === 0) {
      onError?.("결제 수단을 선택해주세요.");
      return;
    }

    if (!payment) {
      onError?.("토스페이먼츠 SDK가 초기화되지 않았습니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 주문 ID 생성 (토스페이먼츠 권장 형식)
      const orderId = `order_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      // 결제 요청 데이터 구성
      const paymentRequestData: any = {
        amount: {
          currency: "KRW",
          value: amount,
        },
        orderId: orderId,
        orderName: orderName,
        customerEmail: customerEmail,
        customerName: customerName,
        customerMobilePhone: "01012341234", // 가상계좌 안내 보내는 번호
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      // 선택된 결제 수단에 따라 설정
      const selectedMethod = selectedMethods[0];
      console.log("선택된 결제 수단:", selectedMethod);

      if (selectedMethod === "VIRTUAL_ACCOUNT") {
        // 무통장입금 - 토스페이먼츠 결제위젯 v2 방식
        console.log("무통장입금 설정 중 (결제위젯 v2)...");

        paymentRequestData.method = "VIRTUAL_ACCOUNT";
        paymentRequestData.successUrl = `${window.location.origin}/payment/success?method=VIRTUAL_ACCOUNT`;
        paymentRequestData.failUrl = `${window.location.origin}/payment/fail?method=VIRTUAL_ACCOUNT`;

        // 가상계좌 설정 (결제위젯 v2)
        paymentRequestData.virtualAccount = {
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 7일 후 만료
          cashReceipt: {
            type: "소득공제",
          },
          useEscrow: false,
        };

        console.log(
          "무통장입금 설정 완료 (결제위젯 v2):",
          paymentRequestData.virtualAccount
        );
      } else {
        // 카드 결제 (기본값)
        console.log("카드 결제 설정 중 (결제위젯 v2)...");
        paymentRequestData.method = "CARD";
      }

      console.log("토스페이먼츠 결제위젯 v2 요청 데이터:", paymentRequestData);
      console.log("토스페이먼츠 결제위젯 v2 인스턴스:", payment);

      // 토스페이먼츠 결제위젯 v2로 결제창 띄우기
      await payment.requestPayment(paymentRequestData);

      // 결제창이 열리면 로딩 상태 해제
      setIsLoading(false);
    } catch (error) {
      console.error("결제위젯 v2 요청 오류:", error);
      setIsLoading(false);

      let errorMessage = "결제 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error details:", error.stack);
      } else if (typeof error === "object" && error !== null) {
        const errorObj = error as { message?: string; code?: string };
        errorMessage = errorObj.message || errorMessage;
        console.error("Error object:", errorObj);
      }

      onError?.(errorMessage);
    }
  };

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isLoading) return "결제창 열는 중...";
    if (!payment) return "SDK 초기화 중...";
    if (selectedMethods.length === 0) return "결제 수단을 선택해주세요";

    const selectedMethod = selectedMethods[0];

    if (selectedMethod === "VIRTUAL_ACCOUNT") {
      return "무통장입금으로 결제하기";
    } else {
      return "카드로 결제하기";
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || selectedMethods.length === 0 || !payment}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <CreditCard className="w-5 h-5" />
      )}
      {getButtonText()}
    </button>
  );
}
