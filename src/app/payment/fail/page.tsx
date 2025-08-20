"use client";

import { useEffect, useState } from "react";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  const [errorInfo, setErrorInfo] = useState<{
    code?: string;
    message?: string;
    orderId?: string;
  }>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setErrorInfo({
      code: urlParams.get("code") || undefined,
      message: urlParams.get("message") || "결제가 실패했습니다.",
      orderId: urlParams.get("orderId") || undefined,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            결제 실패
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            결제 처리 중 오류가 발생했습니다.
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3">
            오류 정보
          </h3>
          <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
            {errorInfo.code && (
              <p>
                <span className="font-medium">오류 코드:</span> {errorInfo.code}
              </p>
            )}
            {errorInfo.message && (
              <p>
                <span className="font-medium">오류 메시지:</span>{" "}
                {errorInfo.message}
              </p>
            )}
            {errorInfo.orderId && (
              <p>
                <span className="font-medium">주문 ID:</span>{" "}
                {errorInfo.orderId}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도하기
          </button>
        </div>
      </div>
    </div>
  );
}
