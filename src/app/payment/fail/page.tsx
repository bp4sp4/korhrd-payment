"use client";

import { useEffect, useState } from "react";
import { XCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  const [errorInfo, setErrorInfo] = useState<{
    code: string;
    message: string;
    orderId: string;
  } | null>(null);

  useEffect(() => {
    // URL 파라미터에서 오류 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const message = urlParams.get("message");
    const orderId = urlParams.get("orderId");

    if (code && message && orderId) {
      setErrorInfo({
        code,
        message: decodeURIComponent(message),
        orderId,
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">
            결제에 실패했습니다
          </h1>
          <p className="text-black">결제 처리 중 오류가 발생했습니다.</p>
        </div>

        {errorInfo && (
          <div className="bg-red-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">오류 정보</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-black">오류 코드</span>
                <span className="font-medium text-black">{errorInfo.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">주문번호</span>
                <span className="font-medium text-black">
                  {errorInfo.orderId}
                </span>
              </div>
              <div className="text-left">
                <span className="text-black">오류 메시지</span>
                <p className="font-medium mt-1 text-black">
                  {errorInfo.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            다시 시도하기
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-6 text-xs text-black">
          <p>계속 문제가 발생한다면</p>
          <p>고객센터로 연락해주세요.</p>
        </div>
      </div>
    </main>
  );
}
