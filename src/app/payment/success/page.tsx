"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [paymentInfo, setPaymentInfo] = useState<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPaymentInfo({
      paymentKey: urlParams.get("paymentKey") || undefined,
      orderId: urlParams.get("orderId") || undefined,
      amount: urlParams.get("amount") || undefined,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            결제 성공!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            결제가 성공적으로 완료되었습니다.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            결제 정보
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {paymentInfo.paymentKey && (
              <p>
                <span className="font-medium">결제 키:</span>{" "}
                {paymentInfo.paymentKey}
              </p>
            )}
            {paymentInfo.orderId && (
              <p>
                <span className="font-medium">주문 ID:</span>{" "}
                {paymentInfo.orderId}
              </p>
            )}
            {paymentInfo.amount && (
              <p>
                <span className="font-medium">결제 금액:</span>{" "}
                {Number(paymentInfo.amount).toLocaleString()}원
              </p>
            )}
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
