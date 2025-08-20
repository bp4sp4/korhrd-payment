"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Home, Receipt } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function PaymentSuccessPage() {
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId: string;
    amount: number;
    method: string;
    approvedAt: string;
  } | null>(null);

  useEffect(() => {
    // URL 파라미터에서 결제 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const amount = urlParams.get("amount");

    if (paymentKey && orderId && amount) {
      setPaymentInfo({
        orderId,
        amount: parseInt(amount),
        method: "토스페이먼츠",
        approvedAt: new Date().toLocaleString("ko-KR"),
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">
            결제가 완료되었습니다!
          </h1>
          <p className="text-black">안전하게 결제가 처리되었습니다.</p>
        </div>

        {paymentInfo && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">결제 정보</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-black">주문번호</span>
                <span className="font-medium text-black">
                  {paymentInfo.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">결제금액</span>
                <span className="font-bold text-black">
                  {formatCurrency(paymentInfo.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">결제수단</span>
                <span className="font-medium text-black">
                  {paymentInfo.method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">결제시간</span>
                <span className="font-medium text-black">
                  {paymentInfo.approvedAt}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <Receipt className="w-5 h-5" />
            영수증 보기
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
          <p>결제 관련 문의사항이 있으시면</p>
          <p>고객센터로 연락해주세요.</p>
        </div>
      </div>
    </main>
  );
}
