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

interface PaymentRequestData {
  amount: {
    currency: string;
    value: number;
  };
  orderId: string;
  orderName: string;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
  method?: string;
  card?: {
    useEscrow: boolean;
    flowMode: string;
    useCardPoint: boolean;
    useAppCardOnly: boolean;
  };
  virtualAccount?: {
    dueDate: string;
    customerName: string;
  };
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
  const [payment, setPayment] = useState<{
    requestPayment: (data: PaymentRequestData) => Promise<void>;
  } | null>(null);

  // 토스페이먼츠 SDK 초기화
  useEffect(() => {
    async function initializeTossPayments() {
      try {
        const clientKey =
          process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
          "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
        const tossPayments = await loadTossPayments(clientKey);

        // 비회원 결제로 설정
        const paymentInstance = tossPayments.payment({
          customerKey: ANONYMOUS,
        });

        setPayment(
          paymentInstance as {
            requestPayment: (data: PaymentRequestData) => Promise<void>;
          }
        );
      } catch (error) {
        console.error("토스페이먼츠 SDK 초기화 오류:", error);
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
      // 주문 ID 생성
      const orderId = `order_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      // 결제 요청 데이터 구성
      const paymentRequestData: PaymentRequestData = {
        amount: {
          currency: "KRW",
          value: amount,
        },
        orderId: orderId,
        orderName: orderName,
        customerEmail: customerEmail,
        customerName: customerName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      // 선택된 결제 수단에 따라 설정
      const selectedMethod = selectedMethods[0];

      if (selectedMethod === "VIRTUAL_ACCOUNT") {
        // 무통장입금 선택된 경우
        paymentRequestData.method = "VIRTUAL_ACCOUNT";
        paymentRequestData.virtualAccount = {
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 7일 후 만료
          customerName: customerName,
        };
      } else {
        // 카드 결제 (기본값)
        paymentRequestData.method = "CARD";
        paymentRequestData.card = {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        };
      }

      console.log("토스페이먼츠 SDK 결제 요청:", paymentRequestData);

      // 토스페이먼츠 SDK로 결제 요청
      await payment.requestPayment(paymentRequestData);

      // 결제창이 열리면 로딩 상태 해제
      setIsLoading(false);
    } catch (error) {
      console.error("결제 요청 오류:", error);
      setIsLoading(false);

      let errorMessage = "결제 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        const errorObj = error as { message?: string };
        errorMessage = errorObj.message || errorMessage;
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
